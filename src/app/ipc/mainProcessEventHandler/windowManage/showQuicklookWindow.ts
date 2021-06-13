import { IpcMainEvent, screen } from 'electron';
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
  const { width, height } = screen.getPrimaryDisplay().size;
  const quicklookWindow = WindowManager.getInstance().getQuicklookWindow();

  quicklookWindow.setBounds({ width: width * 0.6, height: height * 0.75 });
  quicklookWindow.center();
  quicklookWindow.show();
  quicklookWindow.focus();
  quicklookWindow.webContents.send(IPCMainEnum.forwardQuicklookWindowUrl, {
    url,
  });
};
