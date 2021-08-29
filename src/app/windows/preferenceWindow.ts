import path from 'path';
import { app, BrowserWindow } from 'electron';
import constants from '../config/constant';
import pkg from '../config/pkg';
import installExtensions from '../config/electronDevToolsInstaller';

const createPreferenceWindow = () => {
  const preferenceWindow: BrowserWindow = new BrowserWindow({
    title: `Arvis (alpha v${pkg.version})`,
    show: false,
    skipTaskbar: true,
    transparent: false,
    width: constants.preferenceWindowWidth,
    height: constants.preferenceWindowHeight,
    minWidth: constants.preferenceMinWindowWidth,
    minHeight: constants.preferenceMinWindowHeight,
    webPreferences: {
      accessibleTitle: 'arvis-preference-window',
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  preferenceWindow.loadFile(filePath, {
    query: { window: 'preferenceWindow' },
  });

  preferenceWindow.webContents.on('did-finish-load', () => {
    if (!preferenceWindow) {
      throw new Error('"preferenceWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      preferenceWindow.minimize();
    }
  });

  preferenceWindow.webContents.on('did-frame-finish-load', () => {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      installExtensions();
    }
  });

  preferenceWindow.on('show', (e: any) => {
    if (process.platform === 'darwin') {
      app.dock.show();
    }
  });

  preferenceWindow.on('close', (e: any) => {
    e.preventDefault();
    if (preferenceWindow) {
      preferenceWindow.hide();
    }

    if (
      process.platform === 'darwin' &&
      process.env.NODE_ENV !== 'development'
    ) {
      app.dock.hide();
    }
  });

  return preferenceWindow;
};

export { createPreferenceWindow };
