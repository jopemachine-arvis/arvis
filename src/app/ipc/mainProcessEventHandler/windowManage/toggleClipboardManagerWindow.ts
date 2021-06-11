import { IPCMainEnum } from '../../ipcEventEnum';
import { WindowManager } from '../../../windows';

export default ({ showsUp }: { showsUp?: boolean }) => {
  const clipboardManagerWindow =
    WindowManager.getInstance().getClipboardManagerWindow();

  if (!showsUp && clipboardManagerWindow.isVisible()) {
    clipboardManagerWindow.hide();
  } else {
    // Center the window and set y position.
    clipboardManagerWindow.setBounds({ width: 1200, height: 580 });
    clipboardManagerWindow.center();
    clipboardManagerWindow.show();
    clipboardManagerWindow.focus();
    clipboardManagerWindow.webContents.send(IPCMainEnum.renewClipboardStore);
  }
};
