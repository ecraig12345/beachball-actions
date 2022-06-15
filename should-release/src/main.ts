import * as core from '@actions/core';
import * as glob from '@actions/glob';
import {
  checkForNewerRuns,
  cancelRun,
  getEnumInput,
  onUnhandledError,
} from 'beachball-actions-common';

async function main() {
  const batch = core.getBooleanInput('batch');
  const changeGlob = core.getInput('changeGlob');
  const mode = getEnumInput('mode', ['cancel', 'output'] as const, 'cancel');
  const token = core.getInput('token', { required: true });

  let shouldRelease = true;

  const changeFiles = await (await glob.create(changeGlob)).glob();
  if (changeFiles.length === 0) {
    shouldRelease = false;
    core.info('No change files found.');
  } else if (batch && (await checkForNewerRuns(token))) {
    shouldRelease = false;
  }

  if (mode === 'cancel') {
    await cancelRun(token);
  } else {
    core.setOutput('shouldRelease', shouldRelease ? 'yes' : 'no');
  }
}

main().catch(onUnhandledError);
