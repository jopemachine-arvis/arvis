import { dialog, IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';

/**
 * @summary Used to select plugin installer file
 */
export const openPluginInstallFileDialog = async (e: IpcMainEvent) => {
  const extensions = ['arvisplugin'];

  const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Arvis workflow install files',
        extensions,
      },
    ],
  });

  WindowManager.getInstance()
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.openPluginInstallFileDialogRet, {
      file,
    });
};
