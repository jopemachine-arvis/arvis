import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../constants';
import { IPCMainEnum } from '../ipc/ipcEventEnum';

const createSearchWindow = ({
  quicklookWindow,
  largeTextWindow,
}: {
  quicklookWindow: BrowserWindow;
  largeTextWindow: BrowserWindow;
}) => {
  const searchWindow = new BrowserWindow({
    title: 'Arvis',
    show: false,
    frame: false,
    transparent: true,
    disableAutoHideCursor: true,
    skipTaskbar: true,
    movable: true,
    hasShadow: false,
    fullscreenable: false,
    acceptFirstMouse: false,
    alwaysOnTop: false,
    enableLargerThanScreen: false,
    minimizable: false,
    maximizable: false,
    resizable: process.platform !== 'linux',
    width: constants.searchWindowWidth,
    height: constants.searchWindowHeight,
    webPreferences: {
      accessibleTitle: 'arvis-searchwindow',
      contextIsolation: false,
      devTools: true,
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

  searchWindow.loadFile(filePath, {
    query: { window: 'searchWindow' },
  });

  searchWindow.on('will-resize', (e: any, newBounds: Electron.Rectangle) => {
    // Prevent height change
    if (newBounds.height - searchWindow.getSize()[1] !== 0) {
      e.preventDefault();
    }
  });

  searchWindow.on('close', (e) => {
    e.preventDefault();
    if (searchWindow) {
      searchWindow.hide();
    }
  });

  searchWindow.on('blur', (e: any) => {
    e.preventDefault();
    if (!quicklookWindow.isFocused() && !largeTextWindow.isFocused()) {
      searchWindow.webContents.send(IPCMainEnum.hideSearchWindowByBlurEvent);
    }
  });

  searchWindow.on('show', () => {
    searchWindow.webContents.send(IPCMainEnum.searchWindowShowCallback);
  });

  return searchWindow;
};

export { createSearchWindow };
