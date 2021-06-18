import { IpcMainEvent, app } from 'electron';

/**
 * @param  {string} modifier
 */
export const reloadApplication = (e: IpcMainEvent) => {
  app.relaunch();
  app.quit();
};
