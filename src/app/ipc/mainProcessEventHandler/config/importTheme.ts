import { dialog, IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';
import { IPCMainEnum } from '../../ipcEventEnum';

/**
 */
export const importTheme = async (e: IpcMainEvent) => {
  const extensions = ['arvistheme'];

  const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Arvis theme config files',
        extensions,
      },
    ],
  });
  WindowManager.getInstance()
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.importThemeRet, {
      file,
    });
};
