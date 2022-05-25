import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import {
  debug,
  download,
  execCommand,
  FileFsRef,
  getNodeVersion,
  getSpawnOptions,
  glob,
  NodejsLambda,
  readConfigFile,
  runNpmInstall,
  runPackageJsonScript,
  scanParentDirs,
} from '@vercel/build-utils';
import type {
  BuildV2,
  Files,
  NodeVersion,
  PackageJson,
} from '@vercel/build-utils';
import { nodeFileTrace } from '@vercel/nft';
import type { AppConfig } from './types';

export const build: BuildV2 = async ({
  entrypoint,
  files,
  workPath,
  config,
  meta = {},
}) => {
  const { installCommand, buildCommand } = config;

  await download(files, workPath, meta);

  const mountpoint = dirname(entrypoint);
  const entrypointFsDirname = join(workPath, mountpoint);

  // Run "Install Command"
  const nodeVersion = await getNodeVersion(
    entrypointFsDirname,
    undefined,
    config,
    meta
  );

  const spawnOpts = getSpawnOptions(meta, nodeVersion);
  if (!spawnOpts.env) {
    spawnOpts.env = {};
  }
  const { cliType, lockfileVersion } = await scanParentDirs(
    entrypointFsDirname
  );
  if (cliType === 'npm') {
    if (
      typeof lockfileVersion === 'number' &&
      lockfileVersion >= 2 &&
      (nodeVersion?.major || 0) < 16
    ) {
      // Ensure that npm 7 is at the beginning of the `$PATH`
      spawnOpts.env.PATH = `/node16/bin-npm7:${spawnOpts.env.PATH}`;
      console.log('Detected `package-lock.json` generated by npm 7...');
    }
  } else if (cliType === 'pnpm') {
    if (typeof lockfileVersion === 'number' && lockfileVersion === 5.4) {
      // Ensure that pnpm 7 is at the beginning of the `$PATH`
      spawnOpts.env.PATH = `/pnpm7/node_modules/.bin:${spawnOpts.env.PATH}`;
      console.log('Detected `pnpm-lock.yaml` generated by pnpm 7...');
    }
  }

  if (typeof installCommand === 'string') {
    if (installCommand.trim()) {
      console.log(`Running "install" command: \`${installCommand}\`...`);

      const env: Record<string, string> = {
        YARN_NODE_LINKER: 'node-modules',
        ...spawnOpts.env,
      };

      await execCommand(installCommand, {
        ...spawnOpts,
        env,
        cwd: entrypointFsDirname,
      });
    } else {
      console.log(`Skipping "install" command...`);
    }
  } else {
    await runNpmInstall(entrypointFsDirname, [], spawnOpts, meta, nodeVersion);
  }

  // Make `remix build` output production mode
  spawnOpts.env.NODE_ENV = 'production';

  // Run "Build Command"
  if (buildCommand) {
    debug(`Executing build command "${buildCommand}"`);
    await execCommand(buildCommand, {
      ...spawnOpts,
      cwd: entrypointFsDirname,
    });
  } else {
    const pkg = await readConfigFile<PackageJson>(
      join(entrypointFsDirname, 'package.json')
    );
    if (hasScript('vercel-build', pkg)) {
      debug(`Executing "yarn vercel-build"`);
      await runPackageJsonScript(
        entrypointFsDirname,
        'vercel-build',
        spawnOpts
      );
    } else if (hasScript('build', pkg)) {
      debug(`Executing "yarn build"`);
      await runPackageJsonScript(entrypointFsDirname, 'build', spawnOpts);
    } else {
      await execCommand('remix build', {
        ...spawnOpts,
        cwd: entrypointFsDirname,
      });
    }
  }

  let serverBuildPath = 'build/index.js';
  let needsHandler = true;
  try {
    const remixConfig: AppConfig = require(join(
      entrypointFsDirname,
      'remix.config'
    ));

    // If `serverBuildTarget === 'vercel'` then Remix will output a handler
    // that is already in Vercel (req, res) format, so don't inject the handler
    if (remixConfig.serverBuildTarget) {
      if (remixConfig.serverBuildTarget !== 'vercel') {
        throw new Error(
          `\`serverBuildTarget\` in Remix config must be "vercel" (got "${remixConfig.serverBuildTarget}")`
        );
      }
      serverBuildPath = 'api/index.js';
      needsHandler = false;
    }

    if (remixConfig.serverBuildPath) {
      // Explicit file path where the server output file will be
      serverBuildPath = remixConfig.serverBuildPath;
    } else if (remixConfig.serverBuildDirectory) {
      // Explicit directory path the server output will be
      serverBuildPath = join(remixConfig.serverBuildDirectory, 'index.js');
    }
  } catch (err: any) {
    // Ignore error if `remix.config.js` does not exist
    if (err.code !== 'MODULE_NOT_FOUND') throw err;
  }

  const [staticFiles, renderFunction] = await Promise.all([
    glob('**', join(entrypointFsDirname, 'public')),
    createRenderFunction(
      entrypointFsDirname,
      serverBuildPath,
      needsHandler,
      nodeVersion
    ),
  ]);

  return {
    routes: [
      {
        src: '^/build/(.*)$',
        headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        continue: true,
      },
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/render',
      },
    ],
    output: {
      render: renderFunction,
      ...staticFiles,
    },
  };
};

function hasScript(scriptName: string, pkg: PackageJson | null) {
  const scripts = (pkg && pkg.scripts) || {};
  return typeof scripts[scriptName] === 'string';
}

async function createRenderFunction(
  rootDir: string,
  serverBuildPath: string,
  needsHandler: boolean,
  nodeVersion: NodeVersion
): Promise<NodejsLambda> {
  const files: Files = {};
  const handler = needsHandler
    ? join(dirname(serverBuildPath), '__vc_handler.js')
    : serverBuildPath;
  const handlerPath = join(rootDir, handler);

  if (needsHandler) {
    // Copy the `default-server.js` file into the "build" directory
    const sourceHandlerPath = join(__dirname, '../default-server.js');
    await fs.copyFile(sourceHandlerPath, handlerPath);
  }

  // Trace the handler with `@vercel/nft`
  const trace = await nodeFileTrace([handlerPath], {
    base: rootDir,
  });

  let needsVercelAdapter = false;
  for (const warning of trace.warnings) {
    if (warning.message.includes("'@remix-run/vercel'")) {
      needsVercelAdapter = true;
    } else if (warning.stack) {
      debug(warning.stack.replace('Error: ', 'Warning: '));
    }
  }
  for (const file of trace.fileList) {
    files[file] = await FileFsRef.fromFsPath({ fsPath: join(rootDir, file) });
  }

  if (needsVercelAdapter) {
    // Package in the Builder's version of `@remix-run/vercel` Runtime adapter
    const remixVercelPackageJsonPath = require.resolve(
      '@remix-run/vercel/package.json',
      {
        paths: [__dirname],
      }
    );
    const remixVercelPackageJson: PackageJson = require(remixVercelPackageJsonPath);
    const remixVercelDir = dirname(remixVercelPackageJsonPath);
    const remixVercelEntrypoint = join(remixVercelDir, 'index.js');

    console.log(
      `Warning: Implicitly adding \`${remixVercelPackageJson.name}\` v${remixVercelPackageJson.version} to your project. You should add this dependency to your \`package.json\` file.`
    );

    const adapterBase = join(remixVercelDir, '../../..');
    const adapterTrace = await nodeFileTrace([remixVercelEntrypoint], {
      base: adapterBase,
    });
    for (const file of adapterTrace.fileList) {
      files[file] = await FileFsRef.fromFsPath({
        fsPath: join(adapterBase, file),
      });
    }
  }

  const lambda = new NodejsLambda({
    files,
    handler,
    runtime: nodeVersion.runtime,
    shouldAddHelpers: false,
    shouldAddSourcemapSupport: false,
  });

  return lambda;
}
