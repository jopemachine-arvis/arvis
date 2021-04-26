import { BrowserWindow } from 'electron';

export default {
  showSearchWindow: ({
    preferenceWindow,
    searchWindow
  }: {
    preferenceWindow: BrowserWindow;
    searchWindow: BrowserWindow;
  }) => () => {
    if (!searchWindow) {
      throw new Error('"searchWindow" is not defined');
    }

    searchWindow.show();
    searchWindow.focus();
  }
};
