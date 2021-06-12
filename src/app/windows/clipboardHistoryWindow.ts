import { app, BrowserWindow } from 'electron';
import path from 'path';
import constants from '../constants';
// eslint-disable-next-line import/no-cycle
import { WindowManager } from './windowManager';

const createClipboardHistoryWindow = () => {
  const clipboardHistoryWindow = new BrowserWindow({
    title: 'ClipboardHistoryWindow',
    center: true,
    show: false,
    frame: false,
    resizable: true,
    disableAutoHideCursor: true,
    skipTaskbar: true,
    movable: true,
    fullscreenable: false,
    width: constants.clipboardHistoryWindowWidth,
    height: constants.clipboardHistoryWindowHeight,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      accessibleTitle: 'arvis-clipboardHistoryWindow',
      contextIsolation: false,
      experimentalFeatures: false,
      nodeIntegration: true,
      plugins: false,
      scrollBounce: false,
      spellcheck: false,
      webviewTag: false,
    },
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  clipboardHistoryWindow.loadFile(filePath, {
    query: { window: 'clipboardHistoryWindow' },
  });

  clipboardHistoryWindow.on('close', (e) => {
    e.preventDefault();
    if (clipboardHistoryWindow) {
      clipboardHistoryWindow.hide();
    }
  });

  clipboardHistoryWindow.on('blur', () => {
    clipboardHistoryWindow.hide();
  });

  return clipboardHistoryWindow;
};

export { createClipboardHistoryWindow };
