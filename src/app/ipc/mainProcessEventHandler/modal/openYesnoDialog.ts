import { dialog, IpcMainEvent, nativeImage } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';

/**
 * @param  {string} msg
 * @param  {string} icon?
 * @summary Used to open yesno modal box
 */
export const openYesnoDialog = async (
  e: IpcMainEvent,
  { msg, icon }: { msg: string; icon?: string }
) => {
  const ret: Electron.MessageBoxReturnValue = await dialog.showMessageBox({
    type: 'info',
    buttons: ['ok', 'cancel'],
    message: msg,
    icon: icon ? nativeImage.createFromPath(icon) : undefined,
  });

  const yesPressed = ret.response === 0;

  WindowManager.getInstance()
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.openYesnoDialogRet, {
      yesPressed,
    });
};
