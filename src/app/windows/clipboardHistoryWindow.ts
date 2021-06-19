/* eslint-disable @typescript-eslint/ban-types */
import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../constants';

const createClipboardHistoryWindow = (eventHandlers: Map<string, Function>) => {
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
      accessibleTitle: 'arvis-clipboard-history-window',
      contextIsolation: false,
      experimentalFeatures: false,
      nodeIntegration: true,
      plugins: false,
      scrollBounce: false,
      spellcheck: false,
      webviewTag: false,
      enableRemoteModule: true,
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

  const hideClipboardWindow = () => {
    clipboardHistoryWindow.hide();
  };

  eventHandlers.set('clipboardHistoryWindow#blur', hideClipboardWindow);

  clipboardHistoryWindow.on('blur', hideClipboardWindow);

  return clipboardHistoryWindow;
};

export { createClipboardHistoryWindow };
