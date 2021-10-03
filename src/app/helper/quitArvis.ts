import { app, ipcMain } from 'electron';
import { stopFileWatcher } from './fileWatcher';
import { WindowManager } from '../windows/windowManager';

export const quitArvis = () => {
  WindowManager.getInstance().windowAllClose();
  stopFileWatcher();
  ipcMain.removeAllListeners();
  app.exit();
};
