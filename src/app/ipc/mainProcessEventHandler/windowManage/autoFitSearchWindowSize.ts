import { IpcMainEvent, screen } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const autoFitSearchWindowSize = (e: IpcMainEvent) => {
  const screenWidth = screen.getPrimaryDisplay().size.width;

  const minWidth = 450;
  const evaluatedWidth = screenWidth * 0.35;
  const maxWidth = 2000;

  let width = evaluatedWidth;

  width = minWidth > evaluatedWidth ? minWidth : evaluatedWidth;
  width = maxWidth < evaluatedWidth ? maxWidth : evaluatedWidth;

  const searchWindow = WindowManager.getInstance().getSearchWindow();
  searchWindow.setBounds({ width, height: searchWindow.getSize()[1] }, false);

  WindowManager.getInstance()
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.autoFitSearchWindowSizeRet, { width });
};
