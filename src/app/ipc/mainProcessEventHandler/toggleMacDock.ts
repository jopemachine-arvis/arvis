import { app, IpcMainEvent } from 'electron';

/**
 * Only used in mac
 */
export const toggleMacDock = (e: IpcMainEvent, { show }: { show: boolean }) => {
  if (process.platform === 'darwin') {
    if (show) {
      app.dock.hide();
    } else {
      app.dock.show();
    }
  }
};
