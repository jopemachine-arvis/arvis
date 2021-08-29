import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../config/constant';
import { IPCMainEnum } from '../ipc/ipcEventEnum';

const createSearchWindow = ({
  largeTextWindow,
}: {
  largeTextWindow: BrowserWindow;
}) => {
  const searchWindow = new BrowserWindow({
    paintWhenInitiallyHidden: true,
    title: 'SearchWindow',
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
    resizable: true,
    width: constants.searchWindowWidth,
    height: constants.searchWindowHeight,
    webPreferences: {
      accessibleTitle: 'arvis-search-window',
      contextIsolation: false,
      devTools: true,
      experimentalFeatures: false,
      nodeIntegration: true,
      plugins: false,
      scrollBounce: false,
      spellcheck: false,
      enableRemoteModule: true,
      webviewTag: true,
    },
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  searchWindow.loadFile(filePath, {
    query: { window: 'searchWindow' },
  });

  searchWindow.on('close', (e) => {
    e.preventDefault();
    if (searchWindow) {
      searchWindow.hide();
    }
  });

  searchWindow.on('blur', (e: any) => {
    e.preventDefault();
    if (!largeTextWindow.isFocused()) {
      searchWindow.webContents.send(IPCMainEnum.hideSearchWindowByBlurEvent);
    }
  });

  searchWindow.on('show', () => {
    searchWindow.webContents.send(IPCMainEnum.searchWindowShowCallback);
  });

  searchWindow.on('resize', () => {
    const [width] = searchWindow.getSize();
    searchWindow.webContents.send(IPCMainEnum.resizeCurrentSearchWindowWidth, {
      width,
    });
  });

  return searchWindow;
};

export { createSearchWindow };
