import { IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows/windowManager';
import globalShortcutHandler from '../../../config/shortcuts/globalShortcutHandler';

/**
 * Used to register electron global shortcuts in dev mode
 * @param callbackTable
 * @param workflowHotkeyTbl
 */
export const setGlobalShortcut = (
  e: IpcMainEvent,
  {
    callbackTable,
    workflowHotkeyTbl,
  }: { callbackTable: any; workflowHotkeyTbl: string }
) => {
  const hotkeys = globalShortcutHandler({
    callbackTable,
    workflowHotkeyTbl: JSON.parse(workflowHotkeyTbl),
  });

  WindowManager.getInstance()
    .getSearchWindow()
    .webContents.send(IPCMainEnum.setGlobalShortcutRet, {
      registeredShortcuts: hotkeys,
    });
};
