import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../constants';

const createSearchWindow = () => {
  const searchWindow = new BrowserWindow({
    center: true,
    show: false,
    frame: false,
    // To do:: Fix me! 'transparent' window is not working.
    transparent: true,
    resizable: false,
    movable: true,
    hasShadow: true,
    fullscreenable: false,
    backgroundColor: '#00ffffff',
    width: constants.searchWindowWidth,
    height: constants.searchWindowHeight,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  searchWindow.loadFile(filePath, {
    query: { window: 'searchWindow' }
  });

  searchWindow.on('close', e => {
    e.preventDefault();
    if (searchWindow) {
      searchWindow.hide();
    }
  });

  searchWindow.on('blur', () => {
    searchWindow.webContents.send('hide-search-window-by-blur-event');
  });

  return searchWindow;
};

export { createSearchWindow };
