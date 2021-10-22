import {
  app,
  Menu,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
  MenuItem,
} from 'electron';
import { WindowManager } from '../../windows';
import toggleSearchWindow from '../../windows/utils/toggleSearchWindow';
import { checkUpdateManually } from '../../config/appUpdater';
import { openSearchWindowDevTools } from '../../utils/devtoolsHandler';

export default class TrayBuilder {
  trayFilePath: string;

  tray: Tray | null = null;

  trayTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: 'Toggle Arvis..',
      type: 'normal',
      toolTip: 'Open Search Window',
      click: () => {
        toggleSearchWindow({ showsUp: true });
      },
    },
    {
      label: 'Preference..',
      accelerator: `${process.platform === 'darwin' ? 'Cmd' : 'Ctrl'} + ,`,
      type: 'normal',
      toolTip: 'Open Preference Window',
      click: () => {
        const preferenceWindow =
          WindowManager.getInstance().getPreferenceWindow();
        preferenceWindow.show();
        preferenceWindow.focus();
      },
    },
    {
      label: 'Debugging Window..',
      type: 'normal',
      accelerator: 'F11',
      toolTip: 'Open Debugging Window',
      click: () => {
        openSearchWindowDevTools();
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Check for updates..',
      type: 'normal',
      toolTip: 'Check for arvis update',
      enabled: process.platform === 'win32',
      click: () => {
        checkUpdateManually();
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
    this.tray.setToolTip('Arvis');

    this.tray.on('double-click', () => {
      if (process.platform !== 'darwin') {
        const preferenceWindow =
          WindowManager.getInstance().getPreferenceWindow();
        preferenceWindow.show();
        preferenceWindow.focus();
      }
    });
    return this.tray;
  }
}
