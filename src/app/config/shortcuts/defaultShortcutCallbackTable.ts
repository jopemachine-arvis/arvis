import { ipcRenderer } from 'electron';
import { IPCRendererEnum } from '../../ipc/ipcEventEnum';

/**
 * This is a table of callback functions that always require key binding, such as calling searchWindow.
 */
export default {
  toggleSearchWindow: () => () => {
    ipcRenderer.send(IPCRendererEnum.toggleSearchWindow);
  },
  toggleClipboardHistoryWindow: () => () => {
    ipcRenderer.send(IPCRendererEnum.toggleClipboardHistoryWindow);
  },
};
