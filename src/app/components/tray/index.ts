import {
  app,
  Menu,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
  MenuItem,
} from 'electron';
import { WindowManager } from '../../windows';
import toggleSearchWindow from '../../ipc/toggleSearchWindow';

export default class TrayBuilder {
  trayFilePath: string;

  tray: Tray | null = null;

  trayTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: 'Preference..',
      accelerator: `${process.platform === 'darwin' ? 'Cmd' : 'Ctrl'} + ,`,
      type: 'normal',
      toolTip: 'Open Preference Window',
      click: () => {
        const preferenceWindow = WindowManager.getInstance().getPreferenceWindow();
        preferenceWindow.show();
        preferenceWindow.focus();
      },
    },
    {
      label: 'Open Debugging Window',
      type: 'normal',
      accelerator: 'F11',
      toolTip: 'Open Debugging Window',
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
      accelerator: `${process.platform === 'darwin' ? 'Cmd' : 'Ctrl'} + Q`,
      toolTip: 'Quit Arvis',
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

    this.tray.on('click', (e: Electron.KeyboardEvent) => {
      if (process.platform !== 'darwin') {
        toggleSearchWindow({ showsUp: true });
      }
    });

    this.tray.on('double-click', () => {
      const preferenceWindow = WindowManager.getInstance().getPreferenceWindow();
      preferenceWindow.show();
      preferenceWindow.focus();
    });
    return this.tray;
  }
}
