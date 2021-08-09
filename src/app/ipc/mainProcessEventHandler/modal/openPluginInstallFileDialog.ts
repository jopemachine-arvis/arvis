import { dialog, IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';

/**
 * Used to select 'arvisplugin' file
 */
export const openPluginInstallFileDialog = async (e: IpcMainEvent) => {
  const extensions = ['arvisplugin'];

  const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Arvis plugin install files',
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
