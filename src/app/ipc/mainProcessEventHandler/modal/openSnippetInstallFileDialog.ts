import { dialog, IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';
import { openFileDialog } from './utils/openFileDialog';

export const openSnippetInstallFileDialog = async (e: IpcMainEvent) => {
  await openFileDialog({
    filterName: 'Arvis snippet install files',
    extensions: ['arvissnippet', 'alfredsnippet'],
    callback: (file) => {
      WindowManager.getInstance()
        .getPreferenceWindow()
        .webContents.send(IPCMainEnum.openPluginInstallFileDialogRet, {
          file,
        });
    },
  });
};
