import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../constants';
import { IPCMainEnum } from '../ipc/ipcEventEnum';

const createQuicklookWindow = () => {
  const quicklookWindow = new BrowserWindow({
    title: 'Quicklook',
    center: true,
    show: false,
    frame: true,
    resizable: false,
    disableAutoHideCursor: true,
    skipTaskbar: true,
    movable: true,
    fullscreenable: true,
    width: constants.quicklookWindowWidth,
    height: constants.quicklookWindowHeight,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  quicklookWindow.loadFile(filePath, {
    query: { window: 'quicklookWindow' },
  });

  //   searchWindow.on('close', e => {
  //     e.preventDefault();
  //     if (searchWindow) {
  //       searchWindow.hide();
  //     }
  //   });

  //   searchWindow.on('blur', () => {
  //     searchWindow.webContents.send(IPCMainEnum.hideSearchWindowByBlurEvent);
  //   });

  return quicklookWindow;
};

export { createQuicklookWindow };
