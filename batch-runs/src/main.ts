import { checkForNewerRuns, maybeCancelRun, onUnhandledError } from 'beachball-actions-common';

const main = async (): Promise<void> => {
  // Note: action inputs "token" and "mode" are read by utilities
  const shouldCancel = await checkForNewerRuns();

  await maybeCancelRun(shouldCancel);
};

main().catch(onUnhandledError);
