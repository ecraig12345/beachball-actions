import * as core from '@actions/core';
import * as github from '@actions/github';
import { getOctokit } from './getOctokit';
import { logGithubRequestError } from './logGithubRequestError';

function isValidMode(mode: string): mode is 'cancel' | 'output' | '' {
  return !mode || mode === 'cancel' || mode === 'output';
}

/**
 * If this workflow run shouldn't continue, either cancel it or set an output variable
 * depending on the value of the `mode` input.
 *
 * Assumes the following inputs for the action:
 * - `token` (required): github token with permission to cancel workflow runs
 * - `mode`: either `cancel` or `continue`
 *
 * Assumes the following output for the action:
 * - `shouldCancel`: will be `yes` or `no` to avoid ambiguity about booleans vs. strings
 */
export async function maybeCancelRun(shouldCancel: boolean): Promise<void> {
  const mode = core.getInput('mode') || 'cancel';
  if (!isValidMode(mode)) {
    core.setFailed(`Valid options for "mode" are "cancel" or "continue" (received "${mode}")`);
    process.exit(1);
  }

  core.info(`Workflow run should ${shouldCancel ? 'cancel' : 'continue'}`);

  if (shouldCancel && mode === 'cancel') {
    core.info('Canceling this workflow run');

    const workflowRun = Number(process.env.GITHUB_RUN_ID);
    try {
      await getOctokit().rest.actions.cancelWorkflowRun({
        ...github.context.repo,
        run_id: workflowRun,
      });
    } catch (err) {
      logGithubRequestError(err, `canceling workflow run ${workflowRun}`);
      process.exit(1);
    }
  } else {
    core.setOutput('shouldCancel', shouldCancel ? 'yes' : 'no');
  }
}
