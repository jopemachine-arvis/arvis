import path from 'path';
import { BrowserWindow } from 'electron';
import constants from '../constants';

const createPreferenceWindow = () => {
  const pkg = require('../../package.json');
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
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
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

  preferenceWindow.on('close', (e: any) => {
    e.preventDefault();
    if (preferenceWindow) {
      preferenceWindow.hide();
    }
  });

  return preferenceWindow;
};

export { createPreferenceWindow };
