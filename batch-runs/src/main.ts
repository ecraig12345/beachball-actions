import * as core from '@actions/core';
import { cancelWorkflow } from './cancelWorkflow';
import { checkForNewerRuns } from './checkForNewerRuns';

const main = async (): Promise<void> => {
  const token = core.getInput('token', { required: true });
  if (await checkForNewerRuns(token)) {
    await cancelWorkflow(token);
  }
};

main().catch((e) => core.setFailed(e instanceof Error ? e.message : JSON.stringify(e)));
