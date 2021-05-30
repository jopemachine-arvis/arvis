import path from 'path';
import { BrowserWindow } from 'electron';
import constants from '../constants';

const createPreferenceWindow = ({
  searchWindow,
}: {
  searchWindow: BrowserWindow;
}) => {
  const preferenceWindow: BrowserWindow = new BrowserWindow({
    title: 'Arvis',
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
    },
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  preferenceWindow.loadFile(filePath, {
    query: { window: 'preferenceWindow' },
  });

  // To do:: remove below event handler
  preferenceWindow.webContents.on('did-finish-load', () => {
    if (!preferenceWindow) {
      throw new Error('"preferenceWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      preferenceWindow.minimize();
    } else {
      preferenceWindow.show();
      preferenceWindow.focus();
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
