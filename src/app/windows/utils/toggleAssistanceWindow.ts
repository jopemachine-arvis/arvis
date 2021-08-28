import { WindowManager } from '../windowManager';
import { IPCMainEnum } from '../../ipc/ipcEventEnum';

export default ({ mode, showsUp }: { mode: string; showsUp?: boolean }) => {
  const assistanceWindow = WindowManager.getInstance().getAssistanceWindow();

  if (!showsUp && assistanceWindow.isVisible()) {
    assistanceWindow.hide();
  } else {
    // Center the window and set y position.
    assistanceWindow.setBounds({ width: 1200, height: 580 }, false);
    assistanceWindow.center();
    assistanceWindow.show();
    assistanceWindow.focus();
  }

  if (mode === 'clipboardHistory') {
    assistanceWindow.webContents.send(IPCMainEnum.renewClipboardStore);
  }
};
