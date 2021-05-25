import { IpcMainEvent } from 'electron';
import { getFonts } from 'font-list';
import { WindowManager } from '../../../windows';
import { IPCMainEnum } from '../../ipcEventEnum';

/**
 * @summary Used to get all system fonts
 */
export const getSystemFont = async (e: IpcMainEvent) => {
  const fonts = await getFonts({ disableQuoting: true });
  WindowManager.getInstance()
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.getSystemFontRet, {
      fonts,
    });
};
