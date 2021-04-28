import { Menu, BrowserWindow } from 'electron';

import getWindowsTemplate from './windows';
import getDarwinTemplate from './darwin';

export default class MenuBuilder {
  preferenceWindow: BrowserWindow;

  constructor(preferenceWindow: BrowserWindow) {
    this.preferenceWindow = preferenceWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.preferenceWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.preferenceWindow.webContents.inspectElement(x, y);
          }
        }
      ]).popup({ window: this.preferenceWindow });
    });
  }

  buildDarwinTemplate() {
    return getDarwinTemplate(this.preferenceWindow);
  }

  buildDefaultTemplate() {
    return getWindowsTemplate(this.preferenceWindow);
  }
}
