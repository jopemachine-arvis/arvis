import { ipcRenderer } from 'electron';
import is from 'electron-is';
import { IPCRendererEnum } from '../../ipc/ipcEventEnum';
import toggleSearchWindow from '../../windows/utils/toggleSearchWindow';
import toggleAssistanceWindow from '../../windows/utils/toggleAssistanceWindow';

/**
 * This is a table of callback functions that always require key binding, such as calling searchWindow.
 */
export default {
  toggleSearchWindow: () => () => {
    if (is.renderer()) {
      ipcRenderer.send(IPCRendererEnum.toggleSearchWindow, { showsUp: false });
    } else {
      toggleSearchWindow({ showsUp: false });
    }
  },

  toggleClipboardHistoryWindow: () => () => {
    if (is.renderer()) {
      ipcRenderer.send(IPCRendererEnum.toggleClipboardHistoryWindow, {
        showsUp: false,
      });
    } else {
      toggleAssistanceWindow({ mode: 'clipboardHistory', showsUp: false });
    }
  },

  toggleUniversalActionWindow: () => () => {
    if (is.renderer()) {
      ipcRenderer.send(IPCRendererEnum.toggleUniversalActionWindow, {
        showsUp: false,
      });
    } else {
      toggleAssistanceWindow({ mode: 'universalAction', showsUp: false });
    }
  },

  toggleSnippetWindow: () => () => {
    if (is.renderer()) {
      ipcRenderer.send(IPCRendererEnum.toggleUniversalActionWindow, {
        showsUp: false,
      });
    } else {
      toggleAssistanceWindow({ mode: 'snippet', showsUp: false });
    }
  },
};
