import path from 'path';
import { BrowserWindow } from 'electron';
import constants from '../constants';
import MenuBuilder from '../components/menus';

const createPreferenceWindow = ({
  trayBuilder,
  searchWindow,
}: {
  trayBuilder: any;
  searchWindow: BrowserWindow;
}) => {
  let preferenceWindow: BrowserWindow | null = new BrowserWindow({
    title: 'Arvis',
    show: false,
    skipTaskbar: true,
    transparent: false,
    width: constants.preferenceWindowWidth,
    height: constants.preferenceWindowHeight,
    minWidth: constants.preferenceMinWindowWidth,
    minHeight: constants.preferenceMinWindowHeight,
    webPreferences: {
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

  trayBuilder.setPreferenceWindow(preferenceWindow);
  trayBuilder.setSearchWindow(searchWindow);

  preferenceWindow.on('closed', () => {
    preferenceWindow = null;
  });

  const menuBuilder = new MenuBuilder(preferenceWindow);
  menuBuilder.buildMenu();

  return preferenceWindow;
};

export { createPreferenceWindow };
