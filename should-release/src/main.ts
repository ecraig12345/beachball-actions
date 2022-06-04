import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { checkForNewerRuns, maybeCancelRun, onUnhandledError } from 'beachball-actions-common';

async function main() {
  // Note: action inputs "token" and "mode" are read by utilities
  const batch = core.getBooleanInput('batch');
  const changeGlob = core.getInput('changeGlob');

  let shouldCancel = false;

  const changeFiles = await (await glob.create(changeGlob)).glob();
  if (changeFiles.length === 0) {
    shouldCancel = true;
    core.info('No change files found.');
  } else if (batch && (await checkForNewerRuns())) {
    shouldCancel = true;
  }

  await maybeCancelRun(shouldCancel);
}

main().catch(onUnhandledError);
