import * as core from '@actions/core';
import * as github from '@actions/github';

function isValidMode(mode: string): mode is 'cancel' | 'output' | '' {
  return !mode || mode === 'cancel' || mode === 'output';
}

export async function handleResult(
  shouldCancel: boolean,
  token: string,
  mode: string,
): Promise<void> {
  if (!isValidMode(mode)) {
    core.setFailed(`Valid options for "mode" are "cancel" or "continue" (received "${mode}")`);
    process.exit(1);
  }

  const result = shouldCancel ? 'cancel' : 'continue';
  core.info(`Workflow run should ${result}`);

  if (mode === 'output') {
    core.setOutput('result', result);
  } else {
    core.info('Canceling this workflow run');

    const octokit = github.getOctokit(token);

    await octokit.rest.actions.cancelWorkflowRun({
      ...github.context.repo,
      run_id: Number(process.env.GITHUB_RUN_ID),
    });
  }
}
