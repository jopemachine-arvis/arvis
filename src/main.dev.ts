/* eslint-disable no-lonely-if */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-new */

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
import chalk from 'chalk';
import { isFirstAppLaunch } from 'electron-util';
import { IPCRendererEnum } from './app/ipc/ipcEventEnum';
import TrayBuilder from './app/components/tray';
import { WindowManager } from './app/windows';
import {
  cleanUpIPCHandlers,
  initIPCHandlers,
} from './app/ipc/mainProcessIPCManager';
import { startFileWatcher, stopFileWatcher } from './app/helper/fileWatcher';
import AppUpdater from './app/config/appUpdater';
import MenuBuilder from './app/components/menus';
import { openArvisFile } from './app/helper/openArvisFileHandler';
import { reduxStoreResetHandler } from './app/store/reduxStoreResetHandler';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

ElectronStore.initRenderer();
Core.path.initializePath();

reduxStoreResetHandler();

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
// For using iohook in renderer process
// To do:: It is deprecated and removed in Electron 14. Find other solution to handle this
app.allowRendererProcessReuse = false;

app.on('before-quit', () => {
  WindowManager.getInstance().windowAllClose();
  stopFileWatcher();
  cleanUpIPCHandlers();
  app.exit();
});

// To do:: open-file is triggered only in macos.
// find other implementation on windows
app.on('open-file', (event: Electron.Event, file: string) => {
  if (!app.isReady()) {
    openFile = file;
  } else {
    openArvisFile(file);
  }
  event.preventDefault();
});

app.on('ready', () => {
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

  if (process.env.NODE_ENV === 'production') {
    new AppUpdater();
  }

  if (openFile) {
    openArvisFile(openFile);
  }

  if (isFirstAppLaunch()) {
    console.log(
      chalk.yellowBright(
        'Arvis first launched.. Initilize search window size..'
      )
    );

    windowManager
      .getSearchWindow()
      .webContents.send(IPCRendererEnum.autoFitSearchWindowSize);
  }

  startFileWatcher();
  initIPCHandlers();

  if (process.platform === 'darwin') {
    app.dock.hide();
  }
});
