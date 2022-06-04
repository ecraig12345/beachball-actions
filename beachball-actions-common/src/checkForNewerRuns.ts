import * as core from '@actions/core';
import * as github from '@actions/github';
import { getOctokit } from './getOctokit';
import { logGithubRequestError } from './logGithubRequestError';

/**
 * Check for newer pending runs of this workflow against the current branch.
 * Assumes a required `token` input for the action.
 */
export async function checkForNewerRuns(): Promise<boolean> {
  if (process.env.GITHUB_REF_TYPE !== 'branch') {
    core.setFailed('This action is only supported for runs against branches.');
    process.exit(1);
  }

  const octokit = getOctokit();

  const branchName = process.env.GITHUB_REF_NAME!;
  const workflowId = process.env.GITHUB_WORKFLOW!;

  let thisBranchRunCount: number;
  try {
    const result = await octokit.rest.actions.listWorkflowRuns({
      ...github.context.repo,
      workflow_id: workflowId,
      status: 'pending' as any, // eslint-disable-line -- "pending" is valid but missing from types
      branch: branchName,
    });
    thisBranchRunCount = result.data.total_count;
  } catch (err) {
    logGithubRequestError(err, `runs of workflow "${workflowId}" for branch "${branchName}"`);
    process.exit(1);
  }

  core.info(`There are ${thisBranchRunCount || 'no'} newer runs pending for ${branchName}.`);
  return thisBranchRunCount > 0;
}
