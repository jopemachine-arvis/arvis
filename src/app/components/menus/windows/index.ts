import { app, shell, BrowserWindow } from 'electron';
import { Core } from '@jopemachine/arvis-core';
import open from 'open';
import path from 'path';

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
    label: 'Help',
    submenu: [
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
        label: 'Search available workflows',
        click() {
          shell.openExternal(
            'https://github.com/jopemachine/arvis/blob/master/documents/workflow-links.md'
          );
        },
      },
      {
        label: 'Search available plugins',
        click() {
          shell.openExternal(
            'https://github.com/jopemachine/arvis/blob/master/documents/plugin-links.md'
          );
        },
      },
      { type: 'separator' },
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
          const historyFilePath = Core.path.getExtensionHistoryPath();
          const historyFilePathArr = historyFilePath.split(path.sep);
          historyFilePathArr.pop();
          open(historyFilePathArr.join(path.sep));
        },
      },
    ],
  },
];
