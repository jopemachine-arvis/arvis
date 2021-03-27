/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import MenuBuilder from './src/components/menu';
import TrayBuilder from './src/components/tray';

import { registerGlobalShortcut } from './src/utils';
import constants from './src/constants';

const trayIconPath = path.join(__dirname, 'resources', 'icons', '24x24.png');
const trayBuilder = new TrayBuilder(trayIconPath);
trayBuilder.buildTray();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let preferenceWindow: BrowserWindow | null = null;
let searchWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createPreferenceWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  preferenceWindow = new BrowserWindow({
    show: false,
    width: constants.preferenceWindowWidth,
    height: constants.preferenceWindowHeight,
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          }
  });

  preferenceWindow.loadFile(`${__dirname}/app.html`, {
    query: { window: 'preferenceWindow' }
  });

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
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

  preferenceWindow.on('closed', () => {
    preferenceWindow = null;
  });

  const menuBuilder = new MenuBuilder(preferenceWindow);
  menuBuilder.buildMenu();

  registerGlobalShortcut(() => {
    if (!searchWindow) {
      throw new Error('"searchWindow" is not defined');
    }

    searchWindow.show();
    searchWindow.focus();
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const createSearchWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  searchWindow = new BrowserWindow({
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
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          }
  });

  searchWindow.loadFile(`${__dirname}/app.html`, {
    query: { window: 'searchWindow' }
  });

  searchWindow.on('closed', () => {
    createSearchWindow();
  });

  searchWindow.on('blur', () => {
    if (searchWindow) {
      searchWindow.hide();
    }
  });
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  createSearchWindow();
  createPreferenceWindow();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (preferenceWindow === null) createPreferenceWindow();
});
