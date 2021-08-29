import { IpcMainEvent, app, Notification } from 'electron';

/**
 * @param e
 */
export const reloadApplication = (e: IpcMainEvent) => {
  // On linux, reloading not works (just quit the app)
  // Reload cause several bugs.
  // So just alert user restart arvis
  // app.relaunch();

  const errorMsg =
    'Arvis is forced to be terminated due to some updates that can only take effect after Arvis restarted. Please just restart Arvis.';

  console.log(errorMsg);

  new Notification({
    title: 'Restart Arvis',
    body: errorMsg,
  }).show();

  app.quit();
};
