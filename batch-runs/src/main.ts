import * as core from '@actions/core';
import {
  checkForNewerRuns,
  cancelRun,
  getEnumInput,
  onUnhandledError,
} from 'beachball-actions-common';

const main = async (): Promise<void> => {
  core.warning(
    'ecraig12345/beachball-actions is deprecated. Please use microsoft/beachball-actions instead.',
  );

  const mode = getEnumInput('mode', ['cancel', 'output'] as const, 'cancel');
  const token = core.getInput('token', { required: true });

  const shouldCancel = await checkForNewerRuns(token);
  if (mode === 'cancel') {
    await cancelRun(token);
  } else {
    core.setOutput('shouldCancel', shouldCancel ? 'yes' : 'no');
  }
};

main().catch(onUnhandledError);
