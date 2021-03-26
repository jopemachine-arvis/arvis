/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import {
  app,
  Menu,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
  MenuItem
} from 'electron';

const trayTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
  { label: 'Item1', type: 'radio' },
  { label: 'Item2', type: 'radio' },
  { label: 'Item3', type: 'radio', checked: true },
  { label: 'Item4', type: 'radio' }
];

export default class TrayBuilder {
  trayFilePath: string;

  tray: Tray | null = null;

  constructor(trayFilePath: string) {
    this.trayFilePath = trayFilePath;
  }

  buildTray() {
    const nimage = nativeImage.createFromPath(this.trayFilePath);

    app.whenReady().then(() => {
      this.tray = new Tray(nimage);
      const contextMenu = Menu.buildFromTemplate(trayTemplate);
      this.tray.setToolTip('This is my application.');
      this.tray.setContextMenu(contextMenu);
    });
  }
}
