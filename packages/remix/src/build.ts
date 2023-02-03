import { Project } from 'ts-morph';
import { promises as fs } from 'fs';
import { basename, dirname, extname, join, relative } from 'path';
import {
  debug,
  download,
  execCommand,
  FileFsRef,
  getEnvForPackageManager,
  getNodeVersion,
  getSpawnOptions,
  glob,
  EdgeFunction,
  NodejsLambda,
  readConfigFile,
  runNpmInstall,
  runPackageJsonScript,
  scanParentDirs,
} from '@vercel/build-utils';
import { getConfig } from '@vercel/static-config';
import { nodeFileTrace } from '@vercel/nft';
import { readConfig, RemixConfig } from '@remix-run/dev/dist/config';
import type {
  BuildV2,
  Files,
  NodeVersion,
  PackageJson,
  BuildResultV2Typical,
} from '@vercel/build-utils';
import type { ConfigRoute } from '@remix-run/dev/dist/config/routes';
import { findConfig } from './utils';

export const build: BuildV2 = async ({
  entrypoint,
  files,
  workPath,
  repoRootPath,
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

  spawnOpts.env = getEnvForPackageManager({
    cliType,
    lockfileVersion,
    nodeVersion,
    env: spawnOpts.env || {},
  });

  if (typeof installCommand === 'string') {
    if (installCommand.trim()) {
      console.log(`Running "install" command: \`${installCommand}\`...`);
      await execCommand(installCommand, {
        ...spawnOpts,
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

  // We need to patch the `remix.config.js` file to force some values necessary
  // for a build that works on either Node.js or the Edge runtime
  const remixConfigPath = findConfig(entrypointFsDirname, 'remix.config');
  const renamedRemixConfigPath = remixConfigPath
    ? `${remixConfigPath}.original${extname(remixConfigPath)}`
    : undefined;
  console.log({ remixConfigPath, renamedRemixConfigPath });
  if (remixConfigPath && renamedRemixConfigPath) {
    await fs.rename(remixConfigPath, renamedRemixConfigPath);

    // Figure out if the `remix.config` file is using ESM syntax
    let isESM = false;
    try {
      eval('require(renamedRemixConfigPath)');
    } catch (err: any) {
      if (err.code === 'ERR_REQUIRE_ESM') {
        isESM = true;
      } else {
        throw err;
      }
    }

    let patchedConfig: string;
    if (isESM) {
      patchedConfig = `import config from './${basename(
        renamedRemixConfigPath
      )}';
config.serverBuildTarget = undefined;
config.server = undefined;
config.serverModuleFormat = 'esm';
config.serverPlatform = 'neutral';
config.serverBuildPath = 'build/index.js';
export default config;`;
    } else {
      patchedConfig = `const config = require('./${basename(
        renamedRemixConfigPath
      )}');
config.serverBuildTarget = undefined;
config.server = undefined;
config.serverModuleFormat = 'esm';
config.serverPlatform = 'neutral';
config.serverBuildPath = 'build/index.js';
module.exports = config;`;
    }
    await fs.writeFile(remixConfigPath, patchedConfig);
  }

  // Run "Build Command"
  let remixConfig: RemixConfig;
  try {
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
    remixConfig = await readConfig(entrypointFsDirname);
  } finally {
    // Clean up our patched `remix.config.js` to be polite
    if (remixConfigPath && renamedRemixConfigPath) {
      await fs.rename(renamedRemixConfigPath, remixConfigPath);
    }
  }

  console.log(remixConfig);
  const { serverBuildPath, routes } = remixConfig;

  // If `serverBuildTarget === 'vercel'` then Remix will output a handler
  // that is already in Vercel (req, res) format, so don't inject the handler
  //if (remixConfig.serverBuildTarget) {
  //  //if (remixConfig.serverBuildTarget !== 'vercel') {
  //  //  throw new Error(
  //  //    `\`serverBuildTarget\` in Remix config must be "vercel" (got "${remixConfig.serverBuildTarget}")`
  //  //  );
  //  //}
  //  serverBuildPath = 'api/index.js';
  //  needsHandler = false;
  //}

  //if (remixConfig.serverBuildPath) {
  //  // Explicit file path where the server output file will be
  //  serverBuildPath = remixConfig.serverBuildPath;
  ////} else if (remixConfig.serverBuildDirectory) {
  ////  // Explicit directory path the server output will be
  ////  serverBuildPath = join(remixConfig.serverBuildDirectory, 'index.js');
  //}

  //// Also check for whether were in a monorepo.
  //// If we are, prepend the app root directory from config onto the build path.
  //// e.g. `/apps/my-remix-app/api/index.js`
  //const isMonorepo = repoRootPath && repoRootPath !== workPath;
  //if (isMonorepo) {
  //  const rootDirectory = relative(repoRootPath, workPath);
  //  serverBuildPath = join(rootDirectory, serverBuildPath);
  //}

  // Remix enforces that `serverBuildPath` ends with `.js`,
  // but we want to rename from `.js` to `.mjs`
  const renamedServerBuildPath = serverBuildPath.replace(/\.js$/, '.mjs');
  await fs.rename(serverBuildPath, renamedServerBuildPath);

  // Figure out which pages should be edge functions
  const edgePages = new Set<ConfigRoute>();
  const project = new Project();
  for (const route of Object.values(routes)) {
    if (route.id === 'root') continue;
    const routePath = join(remixConfig.appDirectory, route.file);
    const staticConfig = getConfig(project, routePath);
    const isEdge =
      staticConfig?.runtime === 'edge' ||
      staticConfig?.runtime === 'experimental-edge';
    if (isEdge) {
      edgePages.add(route);
    }
  }

  const [staticFiles, nodeFunction, edgeFunction] = await Promise.all([
    glob('**', dirname(remixConfig.assetsBuildDirectory)),
    createRenderNodeFunction(
      entrypointFsDirname,
      repoRootPath,
      renamedServerBuildPath,
      nodeVersion
    ),
    edgePages.size > 0
      ? createRenderEdgeFunction(
          entrypointFsDirname,
          repoRootPath,
          renamedServerBuildPath
        )
      : undefined,
  ]);

  const output: BuildResultV2Typical['output'] = staticFiles;

  for (const route of Object.values(routes)) {
    if (route.id === 'root') continue;
    const isEdge = edgePages.has(route);
    const fn = isEdge && edgeFunction ? edgeFunction : nodeFunction;
    output[route.path || 'index'] = fn;
  }

  // Add a 404 path for not found pages to be server-side rendered by Remix.
  // Use the edge function if one was generated, otherwise use Node.js.
  output['404'] = edgeFunction || nodeFunction;

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
        dest: '/404',
      },
    ],
    output,
  };
};

function hasScript(scriptName: string, pkg: PackageJson | null) {
  const scripts = (pkg && pkg.scripts) || {};
  return typeof scripts[scriptName] === 'string';
}

async function createRenderNodeFunction(
  entrypointDir: string,
  rootDir: string,
  serverBuildPath: string,
  nodeVersion: NodeVersion
): Promise<NodejsLambda> {
  const files: Files = {};

  const relativeServerBuildPath = relative(rootDir, serverBuildPath);
  const handler = join(dirname(relativeServerBuildPath), 'server-node.mjs');
  const handlerPath = join(rootDir, handler);

  // Copy the `server-node.mjs` file into the "build" directory
  const sourceHandlerPath = join(__dirname, '../server-node.mjs');
  await fs.copyFile(sourceHandlerPath, handlerPath);

  // Trace the handler with `@vercel/nft`
  const trace = await nodeFileTrace([handlerPath], {
    base: rootDir,
    processCwd: entrypointDir,
  });

  for (const warning of trace.warnings) {
    console.log(`Warning from trace: ${warning.message}`);
  }

  for (const file of trace.fileList) {
    files[file] = await FileFsRef.fromFsPath({ fsPath: join(rootDir, file) });
  }

  const lambda = new NodejsLambda({
    files,
    handler,
    runtime: nodeVersion.runtime,
    shouldAddHelpers: false,
    shouldAddSourcemapSupport: false,
    operationType: 'SSR',
  });

  return lambda;
}

async function createRenderEdgeFunction(
  entrypointDir: string,
  rootDir: string,
  serverBuildPath: string
): Promise<EdgeFunction> {
  const files: Files = {};

  const relativeServerBuildPath = relative(rootDir, serverBuildPath);
  const handler = join(dirname(relativeServerBuildPath), 'server-edge.mjs');
  const handlerPath = join(rootDir, handler);

  // Copy the `server-edge.mjs` file into the "build" directory
  const sourceHandlerPath = join(__dirname, '../server-edge.mjs');
  await fs.copyFile(sourceHandlerPath, handlerPath);

  // Trace the handler with `@vercel/nft`
  const trace = await nodeFileTrace([handlerPath], {
    base: rootDir,
    processCwd: entrypointDir,
    conditions: ['worker', 'browser'],
    async readFile(fsPath) {
      let source: Buffer | string;
      try {
        source = await fs.readFile(fsPath);
      } catch (err: any) {
        if (err.code === 'ENOENT' || err.code === 'EISDIR') {
          return null;
        }
        throw err;
      }
      if (basename(fsPath) === 'package.json') {
        // For Edge Functions, patch "main" field to prefer "browser" or "module"
        const pkgJson = JSON.parse(source.toString());
        for (const prop of ['browser', 'module']) {
          const val = pkgJson[prop];
          if (typeof val === 'string') {
            //console.log(`Using "${prop}" field in ${fsPath}`);
            pkgJson.main = val;

            // Return the modified `package.json` to nft
            source = JSON.stringify(pkgJson);
            break;
          }
        }
      }
      return source;
    },
  });

  for (const warning of trace.warnings) {
    console.log(`Warning from trace: ${warning.message}`);
  }

  for (const file of trace.fileList) {
    files[file] = await FileFsRef.fromFsPath({ fsPath: join(rootDir, file) });
  }

  const fn = new EdgeFunction({
    files,
    deploymentTarget: 'v8-worker',
    name: 'render',
    entrypoint: handler,
  });

  return fn;
}
