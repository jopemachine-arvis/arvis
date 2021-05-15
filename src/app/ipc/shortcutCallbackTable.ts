import { BrowserWindow, screen } from 'electron';

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
      const { height } = screen.getPrimaryDisplay().size;
      searchWindow.setPosition(x, Math.round(height / 8));
      searchWindow.show();
      searchWindow.focus();
    }
  },
};
