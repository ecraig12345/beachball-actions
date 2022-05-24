import * as core from '@actions/core';
import * as github from '@actions/github';

export async function cancelWorkflow(token: string): Promise<void> {
  core.info('Canceling this workflow run');

  const octokit = github.getOctokit(token);

  await octokit.rest.actions.cancelWorkflowRun({
    ...github.context.repo,
    run_id: Number(process.env.GITHUB_RUN_ID),
  });
}
