import core from '@actions/core';
import github from '@actions/github';

export async function checkForNewerRuns(token: string): Promise<boolean> {
  if (process.env.GITHUB_REF_TYPE !== 'branch') {
    core.setFailed('This action is only supported for runs against branches.');
    process.exit(1);
  }

  const octokit = github.getOctokit(token);

  const branchName = process.env.GITHUB_REF_NAME!;
  const result = await octokit.rest.actions.listWorkflowRuns({
    ...github.context.repo,
    workflow_id: process.env.GITHUB_WORKFLOW || '',
    status: 'pending' as any, // eslint-disable-line -- "pending" is valid but missing from types
    branch: branchName,
  });

  const thisBranchRunCount = result.data.total_count;
  core.info(`There are ${thisBranchRunCount || 'no'} newer runs pending for ${branchName}.`);
  return thisBranchRunCount > 0;
}
