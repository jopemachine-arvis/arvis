/* eslint-disable class-methods-use-this */
import { Menu } from 'electron';

import getWindowsTemplate from './windows';
import getDarwinTemplate from './darwin';

import { WindowManager } from '../../windows';

export default class MenuBuilder {
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
    const preferenceWindow = WindowManager.getInstance().getPreferenceWindow();
    preferenceWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            preferenceWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: preferenceWindow });
    });
  }

  buildDarwinTemplate() {
    return getDarwinTemplate(WindowManager.getInstance().getPreferenceWindow());
  }

  buildDefaultTemplate() {
    return getWindowsTemplate(
      WindowManager.getInstance().getPreferenceWindow()
    );
  }
}
