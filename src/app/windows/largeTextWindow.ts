import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../constants';

const createLargeTextWindow = () => {
  const largeTypeWindow = new BrowserWindow({
    title: 'LargeTextWindow',
    center: true,
    show: false,
    frame: false,
    resizable: false,
    disableAutoHideCursor: true,
    skipTaskbar: true,
    movable: false,
    fullscreenable: false,
    width: constants.largeTextWindowWidth,
    height: constants.largeTextWindowHeight,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  largeTypeWindow.loadFile(filePath, {
    query: { window: 'largeTextWindow' },
  });

  largeTypeWindow.on('close', (e) => {
    e.preventDefault();
    if (largeTypeWindow) {
      largeTypeWindow.hide();
    }
  });

  largeTypeWindow.on('blur', () => {
    largeTypeWindow.hide();
  });

  return largeTypeWindow;
};

export { createLargeTextWindow };
