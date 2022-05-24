import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { cancelWorkflow } from 'batch-runs-action/lib/cancelWorkflow';
import { checkForNewerRuns } from 'batch-runs-action/lib/checkForNewerRuns';

async function main() {
  const token = core.getInput('token', { required: true });
  const batch = core.getBooleanInput('batch');
  const changeGlob = core.getInput('change-glob');

  let shouldCancel = false;

  const changeFiles = await (await glob.create(changeGlob)).glob();
  if (changeFiles.length > 0) {
    shouldCancel = true;
    core.info('No change files found.');
  } else if (batch && (await checkForNewerRuns(token))) {
    shouldCancel = true;
  }

  if (shouldCancel) {
    await cancelWorkflow(token);
  }
}

main().catch((e) => core.setFailed(e instanceof Error ? e.message : JSON.stringify(e)));
