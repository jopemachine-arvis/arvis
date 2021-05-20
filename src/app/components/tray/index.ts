import {
  app,
  Menu,
  Tray,
  nativeImage,
  BrowserWindow,
  MenuItemConstructorOptions,
  MenuItem,
} from 'electron';
import { createPreferenceWindow } from '../../windows/preferenceWindow';

export default class TrayBuilder {
  trayFilePath: string;

  tray: Tray | null = null;

  preferenceWindow: BrowserWindow | null = null;

  searchWindow: BrowserWindow | null = null;

  trayTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: 'Open Preference Window',
      type: 'normal',
      click: () => {
        if (this.preferenceWindow === null) {
          throw new Error('Preference window is not linked.');
        } else if (this.preferenceWindow.isDestroyed()) {
          this.setPreferenceWindow(
            createPreferenceWindow({
              trayBuilder: this,
              searchWindow: this.searchWindow!,
            })
          );
        }
        this.preferenceWindow.show();
        this.preferenceWindow.focus();
      },
    },
    {
      label: 'Show Debugging Window',
      type: 'normal',
      click: () => {
        if (this.searchWindow) {
          this.searchWindow.webContents.toggleDevTools();
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit app',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ];

  constructor(trayFilePath: string) {
    this.trayFilePath = trayFilePath;
  }

  buildTray() {
    app
      .whenReady()
      .then(() => {
        this.tray = new Tray(nativeImage.createFromPath(this.trayFilePath));
        const contextMenu = Menu.buildFromTemplate(this.trayTemplate);
        this.tray.setContextMenu(contextMenu);
        return null;
      })
      .catch(console.error);
  }

  setPreferenceWindow(preferenceWindow: BrowserWindow) {
    this.preferenceWindow = preferenceWindow;
  }

  setSearchWindow(searchWindow: BrowserWindow) {
    this.searchWindow = searchWindow;
  }
}
