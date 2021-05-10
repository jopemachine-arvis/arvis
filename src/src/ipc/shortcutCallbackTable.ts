import { BrowserWindow } from 'electron';

export default {
  toggleSearchWindow: ({
    preferenceWindow,
    searchWindow
  }: {
    preferenceWindow: BrowserWindow;
    searchWindow: BrowserWindow;
  }) => () => {
    if (!searchWindow) {
      throw new Error('"searchWindow" is not defined');
    }

    if (searchWindow.isVisible()) {
      searchWindow.hide();
    } else {
      searchWindow.show();
      searchWindow.focus();
    }
  }
};
