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
import ElectronStore from 'electron-store';
import { Core } from 'arvis-core';
import TrayBuilder from './app/components/tray';
import {
  createPreferenceWindow,
  createQuicklookWindow,
  createSearchWindow,
} from './app/windows';
import { initIPCHandler } from './app/ipc/mainProcessEventHandler';
import { startFileWatcher } from './app/helper/workflowConfigFileWatcher';
import installExtensions from './app/config/extensionInstaller';

let preferenceWindow: BrowserWindow | null = null;
let searchWindow: BrowserWindow | null = null;
let quicklookWindow: BrowserWindow | null = null;

const trayIconPath = path.join(
  __dirname,
  '../',
  'assets',
  'icons',
  '24x24.png'
);
const trayBuilder = new TrayBuilder(trayIconPath);
trayBuilder.buildTray();

ElectronStore.initRenderer();

// If run a specific script with Electron, app name would be Electron. (Not Arvis)
// To do:: In production, The storage location of the setup file should be Arvis, not Electron.
// In development env, setting file should be under /Users/me/Library/Application Support/Electron
// because app.getPath('userData') return 'Electron' as App name.
app.name = 'Arvis';

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

app.on('ready', async () => {
  const onReadyHandler = () => {
    searchWindow = createSearchWindow();
    quicklookWindow = createQuicklookWindow();
    preferenceWindow = createPreferenceWindow({ trayBuilder, searchWindow });

    // Open debugging tool by 'undocked'
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      installExtensions();
      searchWindow.webContents.openDevTools({ mode: 'undocked' });
    }

    startFileWatcher({ searchWindow, preferenceWindow });
    initIPCHandler({ searchWindow, preferenceWindow });
  };

  setTimeout(() => {
    onReadyHandler();
  }, 300);
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (preferenceWindow === null) {
    preferenceWindow = createPreferenceWindow({
      trayBuilder,
      searchWindow: searchWindow!,
    });
  }
});
