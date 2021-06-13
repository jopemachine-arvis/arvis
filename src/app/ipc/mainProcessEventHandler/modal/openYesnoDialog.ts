import { dialog, IpcMainEvent, MessageBoxOptions, nativeImage } from 'electron';
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
  const arg: MessageBoxOptions = {
    type: 'info',
    buttons: ['ok', 'cancel'],
    message: msg,
  };

  if (icon) {
    arg.icon = nativeImage.createFromPath(icon);
  }

  const ret: Electron.MessageBoxReturnValue = await dialog.showMessageBox(arg);

  const yesPressed = ret.response === 0;

  WindowManager.getInstance()
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.openYesnoDialogRet, {
      yesPressed,
    });
};
