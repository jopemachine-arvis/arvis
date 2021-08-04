import { IpcMainEvent, screen } from 'electron';
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
  const { width, height } = screen.getPrimaryDisplay().size;
  const largeTextWindow = WindowManager.getInstance().getLargeTextWindow();

  largeTextWindow.setBounds(
    {
      width: Math.floor(width * 0.6),
      height: Math.floor(height * 0.6),
    },
    false
  );

  largeTextWindow.center();
  largeTextWindow.show();
  largeTextWindow.focus();
  largeTextWindow.webContents.send(IPCMainEnum.forwardLargeText, {
    text,
  });
};
