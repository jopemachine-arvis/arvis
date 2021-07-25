import { dialog, IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';

/**
 * @param title
 * @param message
 * @param defaultPath
 * @summary Used to select file to save
 */
export const saveFile = async (
  e: IpcMainEvent,
  {
    title,
    message,
    defaultPath,
  }: { title: string; message: string; defaultPath: string }
) => {
  const file = await dialog.showSaveDialog({
    title,
    defaultPath,
    message: message ?? 'Select the path your file will be saved',
  });

  WindowManager.getInstance()
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.saveFileRet, {
      file,
    });
};
