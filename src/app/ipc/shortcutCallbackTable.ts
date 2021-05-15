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
      // Center the window and set y position.
      searchWindow.center();
      const [x] = searchWindow.getPosition();
      searchWindow.setPosition(x, 150);
      searchWindow.show();
      searchWindow.focus();
    }
  },
};
