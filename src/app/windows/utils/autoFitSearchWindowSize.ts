import { screen } from 'electron';
import { IPCMainEnum } from '../../ipc/ipcEventEnum';
import { WindowManager } from '..';

/**
 * Adjust the setting value to match the size of the user screen
 * Only called when arvis run first time.
 */
export const autoFitSearchWindowSize = () => {
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
    .webContents.send(IPCMainEnum.autoFitSearchWindowSize, { width });
};
