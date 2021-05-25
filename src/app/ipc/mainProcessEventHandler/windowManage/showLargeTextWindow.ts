import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';
import { IPCMainEnum } from '../../ipcEventEnum';

/**
 * @summary
 */
export const showLargeTextWindow = (
  e: IpcMainEvent,
  {
    text,
  }: {
    text: string;
  }
) => {
  const largeTextWindow = WindowManager.getInstance().getLargeTextWindow();
  largeTextWindow.center();
  largeTextWindow.show();
  largeTextWindow.focus();
  largeTextWindow.webContents.send(IPCMainEnum.forwardLargeText, {
    text,
  });
};
