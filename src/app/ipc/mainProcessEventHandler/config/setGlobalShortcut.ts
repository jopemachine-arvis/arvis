import { IpcMainEvent } from 'electron';
import globalShortcutHandler from '../../globalShortcutHandler';

/**
 * Used to register global shortcuts
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
  globalShortcutHandler({
    callbackTable,
    workflowHotkeyTbl: JSON.parse(workflowHotkeyTbl),
  });
};
