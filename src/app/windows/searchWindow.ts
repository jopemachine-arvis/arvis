import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../constants';
import { IPCMainEnum } from '../ipc/ipcEventEnum';

const createSearchWindow = ({
  quicklookWindow,
}: {
  quicklookWindow: BrowserWindow;
}) => {
  const searchWindow = new BrowserWindow({
    title: 'Arvis',
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    disableAutoHideCursor: true,
    skipTaskbar: true,
    movable: true,
    hasShadow: true,
    fullscreenable: false,
    acceptFirstMouse: false,
    alwaysOnTop: false,
    enableLargerThanScreen: false,
    width: constants.searchWindowWidth,
    height: constants.searchWindowHeight,
    webPreferences: {
      accessibleTitle: 'arvis-searchwindow',
      devTools: true,
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
    if (!quicklookWindow.isFocused()) {
      searchWindow.webContents.send(IPCMainEnum.hideSearchWindowByBlurEvent);
    }
  });

  searchWindow.on('show', () => {
    searchWindow.webContents.send(IPCMainEnum.searchWindowShowCallback);
  });

  return searchWindow;
};

export { createSearchWindow };
