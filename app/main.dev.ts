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
import TrayBuilder from './src/components/tray';

import { createPreferenceWindow } from './src/windows/preferenceWindow';
import { createSearchWindow } from './src/windows/searchWindow';

let preferenceWindow: BrowserWindow | null = null;
let searchWindow: BrowserWindow | null = null;

const trayIconPath = path.join(__dirname, 'resources', 'icons', '24x24.png');
const trayBuilder = new TrayBuilder(trayIconPath);
trayBuilder.buildTray();

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

app.on('before-quit', () => {
  if (searchWindow && searchWindow.closable) {
    searchWindow.close();
    searchWindow = null;
    app.exit();
  }
});

app.on('ready', () => {
  searchWindow = createSearchWindow();
  createPreferenceWindow({ trayBuilder, searchWindow });
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (preferenceWindow === null) {
    preferenceWindow = createPreferenceWindow({
      trayBuilder,
      searchWindow: searchWindow!
    });
  }
});
