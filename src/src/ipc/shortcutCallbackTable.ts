import { BrowserWindow } from 'electron';

/**
 * @summary This is a table of callback functions that always require key binding, such as calling searchWindow.
 */
export default {
  toggleSearchWindow: ({
    preferenceWindow,
    searchWindow,
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
  },
};
