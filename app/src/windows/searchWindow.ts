import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../constants';

const createSearchWindow = () => {
  const searchWindow = new BrowserWindow({
    center: true,
    show: false,
    frame: false,
    transparent: true,
    width: constants.searchWindowWidth,
    height: constants.searchWindowHeight,
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            preload: path.join(__dirname, '../../', 'dist/renderer.prod.js')
          }
  });

  searchWindow.loadFile(path.join(__dirname, '../../', 'app.html'), {
    query: { window: 'searchWindow' }
  });

  searchWindow.on('close', e => {
    e.preventDefault();
    if (searchWindow) {
      searchWindow.hide();
    }
  });

  searchWindow.on('blur', () => {
    if (searchWindow) {
      searchWindow.hide();
    }
  });

  searchWindow.on('hide', () => {
    searchWindow.webContents.send('searchwindow-hide');
  });

  return searchWindow;
};

export { createSearchWindow };