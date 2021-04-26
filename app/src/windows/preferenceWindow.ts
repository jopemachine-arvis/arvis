import path from 'path';
import { BrowserWindow } from 'electron';
import constants from '../constants';
import MenuBuilder from '../components/menus';
import AppUpdater from '../config/appUpdater';
import installExtensions from '../config/extensionInstaller';

const createPreferenceWindow = ({
  trayBuilder,
  searchWindow
}: {
  trayBuilder: any;
  searchWindow: BrowserWindow;
}) => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    installExtensions();
  }

  let preferenceWindow: BrowserWindow | null = new BrowserWindow({
    show: false,
    width: constants.preferenceWindowWidth,
    height: constants.preferenceWindowHeight,
    minWidth: constants.preferenceMinWindowWidth,
    minHeight: constants.preferenceMinWindowHeight,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  preferenceWindow.loadFile(filePath, {
    query: { window: 'preferenceWindow' }
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

  // eslint-disable-next-line
  new AppUpdater();

  return preferenceWindow;
};

export { createPreferenceWindow };
