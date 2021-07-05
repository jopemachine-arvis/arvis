import { IPCMainEnum } from './ipcEventEnum';
import { WindowManager } from '../windows';

export default ({ showsUp }: { showsUp?: boolean }) => {
  const clipboardHistoryWindow =
    WindowManager.getInstance().getClipboardHistoryWindow();

  if (!showsUp && clipboardHistoryWindow.isVisible()) {
    clipboardHistoryWindow.hide();
  } else {
    // Center the window and set y position.
    clipboardHistoryWindow.setBounds({ width: 1200, height: 580 }, false);
    clipboardHistoryWindow.center();
    clipboardHistoryWindow.show();
    clipboardHistoryWindow.focus();
    clipboardHistoryWindow.webContents.send(IPCMainEnum.renewClipboardStore);
  }
};
