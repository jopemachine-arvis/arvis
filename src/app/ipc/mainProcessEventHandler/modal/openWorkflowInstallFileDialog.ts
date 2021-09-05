import { IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';
import { openFileDialog } from './utils/openFileDialog';

export const openWorkflowInstallFileDialog = async (e: IpcMainEvent) => {
  await openFileDialog({
    filterName: 'Arvis workflow install files',
    extensions: ['arvisworkflow'],
    callback: (file) => {
      WindowManager.getInstance()
        .getPreferenceWindow()
        .webContents.send(IPCMainEnum.openWorkflowInstallFileDialogRet, {
          file,
        });
    },
  });
};
