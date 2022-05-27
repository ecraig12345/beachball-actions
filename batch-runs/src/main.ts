import * as core from '@actions/core';
import { handleResult } from './handleResult';
import { checkForNewerRuns } from './checkForNewerRuns';

const main = async (): Promise<void> => {
  const token = core.getInput('token', { required: true });
  const mode = core.getInput('mode');

  if (mode && mode !== 'cancel' && mode !== 'output') {
    core.setFailed(`Valid options for "mode" are "cancel" or "continue" (received "${mode}")`);
    process.exit(1);
  }

  const shouldCancel = await checkForNewerRuns(token);

  await handleResult(shouldCancel, token, mode);
};

main().catch((e) => core.setFailed(e instanceof Error ? e.message : JSON.stringify(e)));
