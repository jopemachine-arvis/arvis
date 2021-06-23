import { app, BrowserWindow } from 'electron';

export const hideWindowAndRestoreFocus = (window: BrowserWindow) => {
  if (process.platform === 'darwin') {
    app.hide();
  } else if (process.platform === 'win32') {
    window.minimize();
  } else if (process.platform === 'linux') {
    window.hide();
  } else {
    throw new Error(`'${process.platform}' is not valid platform`);
  }
};
