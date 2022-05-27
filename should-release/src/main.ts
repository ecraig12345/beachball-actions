import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { checkForNewerRuns } from 'batch-runs-action/lib/checkForNewerRuns';
import { handleResult } from 'batch-runs-action/lib/handleResult';

async function main() {
  const token = core.getInput('token', { required: true });
  const batch = core.getBooleanInput('batch');
  const changeGlob = core.getInput('change-glob');
  const mode = core.getInput('mode');

  let shouldCancel = false;

  const changeFiles = await (await glob.create(changeGlob)).glob();
  if (changeFiles.length > 0) {
    shouldCancel = true;
    core.info('No change files found.');
  } else if (batch && (await checkForNewerRuns(token))) {
    shouldCancel = true;
  }

  await handleResult(shouldCancel, token, mode);
}

main().catch((e) => core.setFailed(e instanceof Error ? e.message : JSON.stringify(e)));
