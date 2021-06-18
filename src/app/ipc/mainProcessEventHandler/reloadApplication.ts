/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { IpcMainEvent, app } from 'electron';

/**
 * @param  {string} modifier
 */
export const reloadApplication = (e: IpcMainEvent) => {
  // Cause error (SIGABRT) on mac
  app.relaunch();
  app.exit(0);
};
