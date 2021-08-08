import { IpcMainEvent, globalShortcut } from 'electron';

/**
 */
export const unregisterAllShortcuts = (e: IpcMainEvent) => {
  globalShortcut.unregisterAll();
};
