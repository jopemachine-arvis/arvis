import { Core } from 'arvis-core';
import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
} from 'electron';
import open from 'open';
import path from 'path';
import { debugInfo } from 'electron-util';
import { electronStore } from '../../../store/electronStorage';
import { WindowManager } from '../../../windows/windowManager';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default (mainWindow: BrowserWindow) => {
  const subMenuAbout: DarwinMenuItemConstructorOptions = {
    label: 'Arvis',
    submenu: [
      {
        label: 'About Arvis',
        selector: 'orderFrontStandardAboutPanel:',
      },
      { type: 'separator' },
      { label: 'Services', submenu: [] },
      { type: 'separator' },
      {
        label: 'Hide Arvis',
        accelerator: 'Command+H',
        selector: 'hide:',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:',
      },
      { label: 'Show All', selector: 'unhideAllApplications:' },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit();
        },
      },
    ],
  };

  const subMenuViewDev: MenuItemConstructorOptions = {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: () => {
          mainWindow.webContents.reload();
        },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click: () => {
          mainWindow.webContents.toggleDevTools();
        },
      },
    ],
  };
  const subMenuViewProd: MenuItemConstructorOptions = {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      },
    ],
  };
  const subMenuWindow: DarwinMenuItemConstructorOptions = {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:',
      },
      { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
      { type: 'separator' },
      { label: 'Bring All to Front', selector: 'arrangeInFront:' },
    ],
  };
  const subMenuHelp: MenuItemConstructorOptions = {
    label: 'Help',
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
  };

  const subMenuAdvanced: MenuItemConstructorOptions = {
    label: 'Advanced',
    submenu: [
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
        label: 'Initialize redux setting',
        click() {
          WindowManager.getInstance()
            .getPreferenceWindow()
            .webContents.send(IPCMainEnum.resetReduxStore);
        },
      },
      {
        type: 'separator',
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
    ],
  };

  const subMenuEdit: DarwinMenuItemConstructorOptions = {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        selector: 'undo:',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        selector: 'redo:',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:',
      },
    ],
  };

  const subMenuView =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
      ? subMenuViewDev
      : subMenuViewProd;

  return [
    subMenuAbout,
    subMenuEdit,
    subMenuView,
    subMenuWindow,
    subMenuHelp,
    subMenuAdvanced,
  ];
};
