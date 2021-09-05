import { dialog, IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';
import { openFileDialog } from './utils/openFileDialog';

export const openSnippetInstallFileDialog = async (e: IpcMainEvent) => {
  await openFileDialog({
    filterName: 'Arvis snippet install files',
    extensions: ['arvissnippets', 'alfredsnippets'],
    callback: (file) => {
      WindowManager.getInstance()
        .getPreferenceWindow()
        .webContents.send(IPCMainEnum.openSnippetInstallFileDialogRet, {
          file,
        });
    },
  });
};
