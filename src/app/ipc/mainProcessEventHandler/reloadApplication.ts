import { IpcMainEvent, app, Notification } from 'electron';

export const reloadApplication = (e: IpcMainEvent) => {
  // On linux, reloading not works (just quit the app)
  // Reload cause several bugs.
  // So just alert user restart arvis
  // app.relaunch();

  console.log('Should restart..');

  new Notification({
    title: 'Restart Arvis',
    body: 'Force termination due to some updates that can only take effect when Arvis is restarted. Just restart Arvis.',
  }).show();

  app.quit();
};
