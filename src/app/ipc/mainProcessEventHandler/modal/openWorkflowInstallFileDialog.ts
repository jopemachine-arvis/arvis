import { dialog, IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';

/**
 * Used to select arvisworkflow file
 */
export const openWorkflowInstallFileDialog = async (e: IpcMainEvent) => {
  const extensions = ['arvisworkflow'];

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
    .webContents.send(IPCMainEnum.openWorkflowInstallFileDialogRet, {
      file,
    });
};
