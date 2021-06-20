import { IpcMainEvent, app } from 'electron';

/**
 * @param  {string} modifier
 */
export const reloadApplication = (e: IpcMainEvent) => {
  // On linux, reloading not works (just quit the app)
  app.relaunch();
  app.quit();
};
