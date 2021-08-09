import { IpcMainEvent, globalShortcut } from 'electron';

/**
 * Unregister all shortcut registered in electron globalShortcut.
 */
export const unregisterAllShortcuts = (e: IpcMainEvent) => {
  globalShortcut.unregisterAll();
};
