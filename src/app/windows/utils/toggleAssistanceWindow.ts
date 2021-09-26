import { clipboard } from 'electron';
import { sync as readFilePathsFromClipboard } from 'read-filepath-from-clipboard';
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

const resolveUniversalActionTarget = () => {
  const selectedFilePaths = readFilePathsFromClipboard();
  return selectedFilePaths.length > 0
    ? selectedFilePaths.join(' ')
    : clipboard.readText();
};

const toggleUniversalActionWindow = ({ showsUp }: { showsUp?: boolean }) => {
  const assistanceWindow = WindowManager.getInstance().getAssistanceWindow();

  assistanceWindow.webContents.send(IPCMainEnum.captureUniversalActionTarget, {
    target: resolveUniversalActionTarget(),
  });

  toggleAssistanceWindow({ showsUp });
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
