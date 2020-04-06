import chalk from 'chalk';
import { createPromptModule } from 'inquirer';
import { NowContext, ProjectEnvTarget } from '../../types';
import { Output } from '../../util/output';
import Client from '../../util/client';
import stamp from '../../util/output/stamp';
import { getLinkedProject } from '../../util/projects/link';
import addEnvRecord from '../../util/env/add-env-record';
import {
  isValidEnvTarget,
  getEnvTargetPlaceholder,
  getEnvTargetChoices,
} from '../../util/env/env-target';
import readStandardInput from '../../util/input/read-standard-input';
import cmd from '../../util/output/cmd';
import param from '../../util/output/param';
import withSpinner from '../../util/with-spinner';
import { emoji, prependEmoji } from '../../util/emoji';
let ttys = { stdin: process.stdin, stdout: process.stdout };
try {
  ttys = require('ttys');
} catch (e) {
  // fallback to original stdin for Windows
}
const prompt = createPromptModule({ input: ttys.stdin, output: ttys.stdout });

type Options = {
  '--debug': boolean;
};

export default async function add(
  ctx: NowContext,
  opts: Options,
  args: string[],
  output: Output
) {
  const {
    authConfig: { token },
    config,
  } = ctx;
  const { currentTeam } = config;
  const { apiUrl } = ctx;
  const debug = opts['--debug'];
  const client = new Client({ apiUrl, token, currentTeam, debug });
  const link = await getLinkedProject(output, client);

  if (link.status === 'error') {
    return link.exitCode;
  } else if (link.status === 'not_linked') {
    output.print(
      `${chalk.red(
        'Error!'
      )} Your codebase isn’t linked to a project on ZEIT Now. Run ${cmd(
        'now'
      )} to link it.\n`
    );
    return 1;
  } else {
    if (args.length > 2) {
      output.error(
        `Invalid number of arguments. Usage: ${cmd(
          `now env add <name> ${getEnvTargetPlaceholder()}`
        )}`
      );
      return 1;
    }

    const { project } = link;
    let envValue = await readStandardInput();
    const addStamp = stamp();
    let [envName, envTarget] = args;

    let envTargets: ProjectEnvTarget[] = [];
    if (envTarget) {
      if (!isValidEnvTarget(envTarget)) {
        output.error(
          `The environment ${param(
            envTarget
          )} is invalid. It must be one of: ${getEnvTargetPlaceholder()}.`
        );
        return 1;
      }
      envTargets.push(envTarget);
    }

    while (!envName) {
      const { inputName } = await prompt({
        type: 'input',
        name: 'inputName',
        message: `What’s the name of the variable?`,
      });

      if (!inputName) {
        output.error(`Name cannot be empty`);
        continue;
      }

      envName = inputName;
    }

    while (!envValue) {
      const { inputValue } = await prompt({
        type: 'password',
        name: 'inputValue',
        message: `What’s the value of ${envName}?`,
      });

      if (!inputValue) {
        output.error(`Value cannot be empty`);
        continue;
      }

      envValue = inputValue;
    }

    if (envTargets.length === 0) {
      const { inputTargets } = await prompt({
        name: 'inputTargets',
        type: 'checkbox',
        message: `Enable ${envName} in which environments (select multiple)?`,
        choices: getEnvTargetChoices(),
      });
      envTargets = inputTargets;
    }

    await withSpinner('Saving', async () => {
      for (const target of envTargets) {
        await addEnvRecord(
          output,
          client,
          project.id,
          envName,
          envValue,
          target
        );
      }
    });

    output.print(
      `${prependEmoji(
        `Added environment variable ${chalk.bold(
          envName
        )} to project ${chalk.bold(project.name)} ${chalk.gray(addStamp())}`,
        emoji('success')
      )}\n`
    );

    ttys.stdin.destroy();
    return 0;
  }
}
