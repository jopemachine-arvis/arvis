import { Core } from 'arvis-core';
import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import open from 'open';
import path from 'path';

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

  return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
};
