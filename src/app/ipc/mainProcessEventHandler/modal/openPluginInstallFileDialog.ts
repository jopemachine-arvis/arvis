import { IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';
import { openFileDialog } from './utils/openFileDialog';

export const openPluginInstallFileDialog = async (e: IpcMainEvent) => {
  await openFileDialog({
    filterName: 'Arvis plugin install files',
    extensions: ['arvisplugin'],
    callback: (file) => {
      WindowManager.getInstance()
        .getPreferenceWindow()
        .webContents.send(IPCMainEnum.openPluginInstallFileDialogRet, {
          file,
        });
    },
  });
};
