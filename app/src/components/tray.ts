/* eslint-disable no-else-return */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import {
  app,
  Menu,
  Tray,
  nativeImage,
  BrowserWindow,
  MenuItemConstructorOptions,
  MenuItem
} from 'electron';

import { createPreferenceWindow } from '../windows/preferenceWindow';

export default class TrayBuilder {
  trayFilePath: string;

  tray: Tray | null = null;

  preferenceWindow: BrowserWindow | null = null;

  searchWindow: BrowserWindow | null = null;

  trayTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: 'Quit app',
      type: 'normal',
      click: () => {
        app.quit();
      }
    },
    {
      label: 'Open Preference',
      type: 'normal',
      click: () => {
        if (this.preferenceWindow === null) {
          throw new Error('Preference window is not linked.');
        } else if (this.preferenceWindow.isDestroyed()) {
          this.setPreferenceWindow(
            createPreferenceWindow({
              trayBuilder: this,
              searchWindow: this.searchWindow!
            })
          );
        }
        this.preferenceWindow.show();
        this.preferenceWindow.focus();
      }
    },
    {
      label: 'Show Debugging View',
      type: 'normal',
      click: () => {
        this.searchWindow.webContents.toggleDevTools();
      }
    }
  ];

  constructor(trayFilePath: string) {
    this.trayFilePath = trayFilePath;
  }

  buildTray() {
    const nimage = nativeImage.createFromPath(this.trayFilePath);

    app.whenReady().then(() => {
      this.tray = new Tray(nimage);
      const contextMenu = Menu.buildFromTemplate(this.trayTemplate);
      this.tray.setContextMenu(contextMenu);
    });
  }

  setPreferenceWindow(preferenceWindow: BrowserWindow) {
    this.preferenceWindow = preferenceWindow;
  }

  setSearchWindow(searchWindow: BrowserWindow) {
    this.searchWindow = searchWindow;
  }
}
