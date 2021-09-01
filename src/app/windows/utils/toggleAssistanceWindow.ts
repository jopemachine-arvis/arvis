import robot from 'robotjs';
import { WindowManager } from '../windowManager';
import { IPCMainEnum } from '../../ipc/ipcEventEnum';

const assistanceWindowSize = { width: 1200, height: 580 };

const toggleAssistanceWindow = ({ showsUp }: { showsUp?: boolean }) => {
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
};

const toggleClipboardHistory = ({ showsUp }: { showsUp?: boolean }) => {
  const assistanceWindow = WindowManager.getInstance().getAssistanceWindow();

  toggleAssistanceWindow({ showsUp });

  assistanceWindow.webContents.send(IPCMainEnum.renewClipboardStore);
};

const toggleUniversalActionWindow = ({ showsUp }: { showsUp?: boolean }) => {
  robot.keyTap('c', process.platform === 'darwin' ? ['command'] : ['control']);

  setTimeout(() => {
    toggleAssistanceWindow({ showsUp });
  }, 50);
};

const toggleSnippetWindow = ({ showsUp }: { showsUp?: boolean }) => {
  toggleAssistanceWindow({ showsUp });
};

export default ({
  mode,
  showsUp,
}: {
  mode: AssistanceWindowType;
  showsUp?: boolean;
}) => {
  if (mode === 'clipboardHistory') {
    toggleClipboardHistory({ showsUp });
  }

  if (mode === 'universalAction') {
    toggleUniversalActionWindow({ showsUp });
  }

  if (mode === 'snippet') {
    toggleSnippetWindow({ showsUp });
  }

  const assistanceWindow = WindowManager.getInstance().getAssistanceWindow();
  assistanceWindow.webContents.send(IPCMainEnum.setMode, { mode });
};
