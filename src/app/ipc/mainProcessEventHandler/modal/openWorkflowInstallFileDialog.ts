import { dialog, IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';

/**
 * @summary Used to select wfconf file
 */
export const openWorkflowInstallFileDialog = async (
  e: IpcMainEvent,
  { canInstallAlfredWorkflow }: { canInstallAlfredWorkflow: boolean }
) => {
  const extensions = ['arvisworkflow'];
  if (canInstallAlfredWorkflow) extensions.push('alfredworkflow');

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
