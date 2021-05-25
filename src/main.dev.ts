/* eslint-disable no-new */
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
import { app } from 'electron';
import ElectronStore from 'electron-store';
import { Core } from 'arvis-core';
import TrayBuilder from './app/components/tray';
import { WindowManager } from './app/windows';
import {
  cleanUpIPCHandlers,
  initIPCHandlers,
} from './app/ipc/mainProcessIPCManager';
import { startFileWatcher } from './app/helper/workflowConfigFileWatcher';
import installExtensions from './app/config/extensionInstaller';
import AppUpdater from './app/config/appUpdater';
import MenuBuilder from './app/components/menus';

ElectronStore.initRenderer();
Core.path.initializePath();

// Below tray variable should be here to exclude itself from the GC targets
let tray;

// If run a specific script with Electron, app name would be Electron. (Not Arvis)
// To do:: In production, The storage location of the setup file should be Arvis, not Electron.
// In development env, setting file should be under /Users/me/Library/Application Support/Electron
// because app.getPath('userData') return 'Electron' as App name.

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
  require('electron-debug')();
}

app.disableHardwareAcceleration();

app.on('before-quit', () => {
  WindowManager.getInstance().windowAllClose();
  cleanUpIPCHandlers();
  app.exit();
});

app.on('ready', async () => {
  const onReadyHandler = () => {
    const trayIconPath = path.join(
      __dirname,
      '../',
      'assets',
      'icons',
      '24x24.png'
    );
    const trayBuilder = new TrayBuilder(trayIconPath);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tray = trayBuilder.buildTray();

    const menuBuilder = new MenuBuilder();
    menuBuilder.buildMenu();

    const windowManager = WindowManager.getInstance();

    // Open debugging tool by 'undocked'
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      installExtensions();
      windowManager.getSearchWindow().webContents.openDevTools({
        mode: 'undocked',
        activate: true,
      });
    }

    if (process.env.NODE_ENV === 'production') {
      new AppUpdater();
    }

    startFileWatcher();
    initIPCHandlers();
  };

  setTimeout(() => {
    onReadyHandler();
  }, 300);
});
