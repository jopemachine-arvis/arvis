import { IpcMainEvent } from 'electron';
import globalShortcutHandler from '../../globalShortcutHandler';

/**
 * @param callbackTable
 * @param workflowHotkeyTbl
 * @summary Used to register global shortcuts
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
