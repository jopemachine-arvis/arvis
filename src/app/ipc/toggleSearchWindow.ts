import { screen } from 'electron';
import { WindowManager } from '../windows';
import { IPCMainEnum } from './ipcEventEnum';

const handleMacOs = ({ showsUp }: { showsUp?: boolean }) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();

  if (!showsUp && searchWindow.isVisible()) {
    searchWindow.webContents.send(IPCMainEnum.setSearchbarInput, { str: '' });
    searchWindow.hide();
  } else {
    // Center the window and set y position.
    searchWindow.center();
    const [x] = searchWindow.getPosition();
    const { height } = screen.getPrimaryDisplay().size;

    const opacity = searchWindow.getOpacity();
    searchWindow.setOpacity(0);

    searchWindow.setPosition(x, Math.round(height / 8));
    searchWindow.show();

    setTimeout(() => {
      searchWindow.setOpacity(opacity);
      searchWindow.focus();
    }, 150);
  }
};

const handleWindows = ({ showsUp }: { showsUp?: boolean }) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();

  if (!showsUp && searchWindow.isVisible()) {
    searchWindow.webContents.send(IPCMainEnum.setSearchbarInput, { str: '' });
    searchWindow.hide();
  } else {
    // Center the window and set y position.
    searchWindow.center();
    const [x] = searchWindow.getPosition();
    const { height } = screen.getPrimaryDisplay().size;

    // To remove afterimage, move window to unseen position and show
    searchWindow.setPosition(99999, 99999);
    searchWindow.show();

    setTimeout(() => {
      searchWindow.setPosition(x, Math.round(height / 8));
      searchWindow.focus();
    }, 150);
  }
};

const handleLinux = ({ showsUp }: { showsUp?: boolean }) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();

  if (!showsUp && searchWindow.isVisible()) {
    searchWindow.webContents.send(IPCMainEnum.setSearchbarInput, { str: '' });
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
};

export default ({ showsUp }: { showsUp?: boolean }) => {
  // eslint-disable-next-line default-case
  switch (process.platform) {
    case 'win32':
      handleWindows({ showsUp });
      break;
    case 'darwin':
      handleMacOs({ showsUp });
      break;
    case 'linux':
      handleLinux({ showsUp });
      break;
  }
};
