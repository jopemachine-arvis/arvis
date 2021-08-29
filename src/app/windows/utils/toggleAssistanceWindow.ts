import robot from 'robotjs';
import { clipboard } from 'electron';
import { WindowManager } from '../windowManager';
import { IPCMainEnum } from '../../ipc/ipcEventEnum';

const assistanceWindowSize = { width: 1200, height: 580 };

const toggleClipboardHistory = ({ showsUp }: { showsUp?: boolean }) => {
  const assistanceWindow = WindowManager.getInstance().getAssistanceWindow();

  if (!showsUp && assistanceWindow.isVisible()) {
    assistanceWindow.hide();
  } else {
    // Center the window and set y position.
    assistanceWindow.setBounds(assistanceWindowSize, false);
    assistanceWindow.center();
    assistanceWindow.show();
    assistanceWindow.focus();
  }

  assistanceWindow.webContents.send(IPCMainEnum.renewClipboardStore);
};

const toggleUniversalActionWindow = ({ showsUp }: { showsUp?: boolean }) => {
  robot.keyTap('c', process.platform === 'darwin' ? ['command'] : ['control']);

  setTimeout(() => {
    const assistanceWindow = WindowManager.getInstance().getAssistanceWindow();
    assistanceWindow.webContents.send(
      IPCMainEnum.captureUniversalActionTarget,
      { target: clipboard.readText() }
    );

    if (!showsUp && assistanceWindow.isVisible()) {
      assistanceWindow.hide();
    } else {
      // Center the window and set y position.
      assistanceWindow.setBounds(assistanceWindowSize, false);
      assistanceWindow.center();
      assistanceWindow.show();
      assistanceWindow.focus();
    }
  }, 50);
};

export default ({
  mode,
  showsUp,
}: {
  mode: 'clipboardHistory' | 'universalAction';
  showsUp?: boolean;
}) => {
  if (mode === 'clipboardHistory') {
    toggleClipboardHistory({ showsUp });
  }

  if (mode === 'universalAction') {
    toggleUniversalActionWindow({ showsUp });
  }

  const assistanceWindow = WindowManager.getInstance().getAssistanceWindow();
  assistanceWindow.webContents.send(IPCMainEnum.setMode, { mode });
};
