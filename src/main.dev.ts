/* eslint-disable no-lonely-if */
/* eslint-disable import/no-mutable-exports */
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
import ioHook from 'iohook';
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
import { openArvisFile } from './app/helper/openArvisFileHandler';

ElectronStore.initRenderer();
Core.path.initializePath();

// Below tray variable should be here and be exported to exclude itself from the GC targets
export let tray: Electron.Tray;
let openFile: string | undefined;

// If run a specific script with Electron, app name would be Electron. (Not Arvis)
// To do:: In production, The storage location of the setup file should be Arvis, not Electron.
// In development env, setting file should be under /Users/me/Library/Application Support/Electron
// because app.getPath('userData') return 'Electron' as App name.

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

require('electron-debug')();

app.disableHardwareAcceleration();

app.on('before-quit', () => {
  WindowManager.getInstance().windowAllClose();
  cleanUpIPCHandlers();
  ioHook.removeAllListeners();
  ioHook.unload();
  app.exit();
});

app.on('open-file', (event: Electron.Event, file: string) => {
  if (!app.isReady()) {
    openFile = file;
  } else {
    openArvisFile(file);
  }
  event.preventDefault();
});

app.on('ready', () => {
  const onReadyHandler = () => {
    const menuBuilder = new MenuBuilder();
    menuBuilder.buildMenu();

    const trayIconPath = path.join(
      __dirname,
      '../',
      'assets',
      'icons',
      '24x24.png'
    );
    const trayBuilder = new TrayBuilder(trayIconPath);
    tray = trayBuilder.buildTray();

    const windowManager = WindowManager.getInstance();

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

    if (openFile) {
      openArvisFile(openFile);
    }

    startFileWatcher();
    initIPCHandlers();
  };

  setTimeout(() => {
    onReadyHandler();
  }, 300);
});
