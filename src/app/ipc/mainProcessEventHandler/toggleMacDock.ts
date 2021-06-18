/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { app, IpcMainEvent } from 'electron';

/**
 * @param  {string} modifier
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
