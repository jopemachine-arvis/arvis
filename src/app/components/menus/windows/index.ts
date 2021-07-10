import { app, shell, BrowserWindow, dialog } from 'electron';
import { Core } from 'arvis-core';
import open from 'open';
import path from 'path';
import { debugInfo } from 'electron-util';
import {
  arvisReduxStoreResetFlagPath,
  arvisRenewExtensionFlagFilePath,
} from '../../../config/path';
import { electronStore } from '../../../store/electronStorage';
import { WindowManager } from '../../../windows/windowManager';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';

export default (mainWindow: BrowserWindow) => [
  {
    label: '&File',
    submenu: [
      {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click: () => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.close();
          }
        },
      },
      {
        label: '&Quit',
        accelerator: 'Ctrl+Q',
        click: () => {
          app.exit();
        },
      },
    ],
  },
  {
    label: '&View',
    submenu:
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? [
            {
              label: '&Reload',
              accelerator: 'Ctrl+R',
              click: () => {
                mainWindow.webContents.reload();
              },
            },
            {
              label: 'Toggle &Full Screen',
              accelerator: 'F11',
              click: () => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
              },
            },
            {
              label: 'Toggle &Developer Tools',
              accelerator: 'Alt+Ctrl+I',
              click: () => {
                mainWindow.webContents.toggleDevTools();
              },
            },
          ]
        : [
            {
              label: 'Toggle &Full Screen',
              accelerator: 'F11',
              click: () => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
              },
            },
          ],
  },
  {
    label: '&Help',
    submenu: [
      {
        label: 'License',
        click() {
          shell.openExternal(
            'https://github.com/jopemachine/arvis/blob/master/LICENSE'
          );
        },
      },
      {
        label: 'Documentation',
        click() {
          shell.openExternal(
            'https://github.com/jopemachine/arvis/blob/master/README.md'
          );
        },
      },
      {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/jopemachine/arvis/issues');
        },
      },
      {
        label: 'Bug Report / Feature Request',
        click() {
          shell.openExternal(
            'https://github.com/jopemachine/arvis/issues/new/choose'
          );
        },
      },
    ],
  },
  {
    label: '&Advanced',
    submenu: [
      {
        label: '* Debug Info',
        enabled: false,
      },
      {
        label: 'View Debug info',
        click() {
          dialog.showMessageBox(
            WindowManager.getInstance().getPreferenceWindow(),
            { title: 'Debug info', message: debugInfo() }
          );
        },
      },
      {
        type: 'separator',
      },
      {
        label: '* Setting Intialization',
        enabled: false,
      },
      {
        label: 'Initialize Redux Setting',
        click() {
          WindowManager.getInstance()
            .getPreferenceWindow()
            .webContents.send(IPCMainEnum.resetReduxStore);
        },
      },
      {
        label: 'Initialize User Config (variables)',
        click() {
          Core.initialzeUserConfigs();
        },
      },
      {
        label: 'Initialize History',
        click() {
          Core.history.initHistory();
        },
      },
      {
        type: 'separator',
      },
      {
        label: '* Open Debugger',
        enabled: false,
      },
      {
        label: 'Open Search Window Debugger',
        click() {
          WindowManager.getInstance()
            .getSearchWindow()
            .webContents.openDevTools();
        },
      },
      {
        label: 'Open Preference Window Debugger',
        click() {
          WindowManager.getInstance()
            .getPreferenceWindow()
            .webContents.openDevTools();
        },
      },
      {
        label: 'Open ClipboardHistory Window Debugger',
        click() {
          WindowManager.getInstance()
            .getClipboardHistoryWindow()
            .webContents.openDevTools();
        },
      },
      {
        label: 'Open LargeText Window Debugger',
        click() {
          WindowManager.getInstance()
            .getLargeTextWindow()
            .webContents.openDevTools();
        },
      },
      {
        label: 'Open Quicklook Window Debugger',
        click() {
          WindowManager.getInstance()
            .getQuicklookWindow()
            .webContents.openDevTools();
        },
      },
      {
        type: 'separator',
      },
      {
        label: '* Open Setting File Directory',
        enabled: false,
      },
      {
        label: 'Open installed extension folder',
        click() {
          open(Core.path.installedDataPath);
        },
      },
      {
        label: "Open installed extension's cache folder",
        click() {
          open(Core.path.cachePath);
        },
      },
      {
        label: 'Open arvis history file path',
        click() {
          open(path.dirname(Core.path.getExtensionHistoryPath()));
        },
      },
      {
        label: 'Open user config (variables) file path',
        click() {
          open(path.dirname(Core.path.userConfigPath));
        },
      },
      {
        label: 'Open arvis-gui-config file path',
        click() {
          open(path.dirname(electronStore.path));
        },
      },
      {
        label: 'Open arvisReduxStoreResetFlagPath (tempPath)',
        click() {
          open(path.dirname(arvisReduxStoreResetFlagPath));
        },
      },
      {
        label: 'Open arvisRenewExtensionFlagFilePath',
        click() {
          open(path.dirname(arvisRenewExtensionFlagFilePath));
        },
      },
    ],
  },
];
