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
import ElectronStore from '../node_modules/wf-creator-core/node_modules/electron-store/index.js';

import { createPreferenceWindow } from './src/windows/preferenceWindow';
import { createSearchWindow } from './src/windows/searchWindow';

import { initIPCHandler } from './src/helpers/mainProcessEventHandler';

let preferenceWindow: BrowserWindow | null = null;
let searchWindow: BrowserWindow | null = null;

const trayIconPath = path.join(__dirname, 'resources', 'icons', '24x24.png');
const trayBuilder = new TrayBuilder(trayIconPath);
trayBuilder.buildTray();

ElectronStore.initRenderer();

// If run a specific script with Electron, app name would be Electron. (Not wf-creator-gui)
// To do:: In production, The storage location of the setup file should be wf-creator-gui, not Electron.
// In development env, setting file should be under /Users/me/Library/Application Support/Electron
// because app.getPath('userData') return 'Electron' as App name.
app.name = 'wf-creator-gui';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
} else {
  // The below code could also be used for testing in production if needed
  // require('electron-debug')();
}

app.disableHardwareAcceleration();

app.on('before-quit', () => {
  if (searchWindow && searchWindow.closable) {
    searchWindow.close();
    searchWindow = null;
    app.exit();
  }
});

app.on('ready', () => {
  const onReadyHandler = () => {
    searchWindow = createSearchWindow();
    preferenceWindow = createPreferenceWindow({ trayBuilder, searchWindow });

    // Open debugging tool by 'undocked'
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      searchWindow.webContents.openDevTools({ mode: 'undocked' });
    }
    initIPCHandler({ searchWindow, preferenceWindow });
  };

  onReadyHandler();

  // setTimeout(() => {
  //   //* Transparent window hack (Not working)
  //   onReadyHandler();
  // }, 300);
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
