import * as core from '@actions/core';
import * as github from '@actions/github';
import { RequestError } from '@octokit/request-error';

export async function checkForNewerRuns(token: string): Promise<boolean> {
  if (process.env.GITHUB_REF_TYPE !== 'branch') {
    core.setFailed('This action is only supported for runs against branches.');
    process.exit(1);
  }

  console.log(JSON.stringify(github.context, null, 2));

  const octokit = github.getOctokit(token, { log: console });

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
    const description = `runs of workflow "${workflowId}" for branch "${branchName}"`;
    core.error(err as Error);
    if (err instanceof RequestError) {
      core.setFailed(
        `Getting ${description} from "${err.request.url}" failed with code ${err.status}`,
      );
    } else {
      core.setFailed(
        `Error getting ${description}: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
      );
    }
    process.exit(1);
  }

  core.info(`There are ${thisBranchRunCount || 'no'} newer runs pending for ${branchName}.`);
  return thisBranchRunCount > 0;
}
