import path from 'path';
import { BrowserWindow } from 'electron';
import registerGlobalShortcut from '../config/globalShortcuts';
import constants from '../constants';
import MenuBuilder from '../components/menus';
import AppUpdater from '../config/appUpdater';
import installExtensions from '../config/extensionInstaller';
import generateShortcutCallbackTable from '../helpers/shortcutCallbackTable';

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
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            preload: path.join(__dirname, '../../', 'dist/renderer.prod.js')
          }
  });

  preferenceWindow.loadFile(path.join(__dirname, '../../', 'app.html'), {
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

  registerGlobalShortcut(generateShortcutCallbackTable({ searchWindow }));

  // eslint-disable-next-line
  new AppUpdater();

  return preferenceWindow;
};

export { createPreferenceWindow };
