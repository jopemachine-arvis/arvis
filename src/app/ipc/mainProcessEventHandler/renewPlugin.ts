import { IpcMainEvent } from 'electron';
import { getDestWindow } from '../getDestWindow';
import { IPCMainEnum } from '../ipcEventEnum';

/**
 * @param  {string} destWindow
 * @param  {string} bundleId?
 */
export const renewPlugin = (
  e: IpcMainEvent,
  { destWindow, bundleId }: { destWindow: string; bundleId?: string }
) => {
  getDestWindow(destWindow).webContents.send(IPCMainEnum.renewPlugin, {
    bundleId,
  });
};
