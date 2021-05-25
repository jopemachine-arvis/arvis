import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';
import { IPCMainEnum } from '../../ipcEventEnum';

/**
 * @summary
 */
export const showQuicklookWindow = (
  e: IpcMainEvent,
  {
    url,
  }: {
    url: string;
  }
) => {
  const quicklookWindow = WindowManager.getInstance().getQuicklookWindow();
  quicklookWindow.center();
  quicklookWindow.show();
  quicklookWindow.focus();
  quicklookWindow.webContents.send(IPCMainEnum.forwardQuicklookWindowUrl, {
    url,
  });
};
