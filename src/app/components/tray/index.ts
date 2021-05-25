import {
  app,
  Menu,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
  MenuItem,
} from 'electron';
import { WindowManager } from '../../windows';

export default class TrayBuilder {
  trayFilePath: string;

  tray: Tray | null = null;

  trayTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: 'Preference..',
      type: 'normal',
      click: () => {
        const preferenceWindow = WindowManager.getInstance().getPreferenceWindow();
        preferenceWindow.show();
        preferenceWindow.focus();
      },
    },
    {
      label: 'Open Debugging Window',
      type: 'normal',
      click: () => {
        const searchWindow = WindowManager.getInstance().getSearchWindow();
        searchWindow.webContents.toggleDevTools();
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit Arvis',
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
    this.tray = new Tray(nativeImage.createFromPath(this.trayFilePath));
    const contextMenu = Menu.buildFromTemplate(this.trayTemplate);
    this.tray.setContextMenu(contextMenu);
    return this.tray;
  }
}
