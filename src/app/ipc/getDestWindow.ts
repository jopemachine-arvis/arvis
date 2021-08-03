import { BrowserWindow } from 'electron';
import { WindowManager } from '../windows';

/**
 * @param windowName
 */
export const getDestWindow = (windowName: string): BrowserWindow => {
  if (windowName === 'searchWindow') {
    return WindowManager.getInstance().getSearchWindow();
  }
  if (windowName === 'preferenceWindow') {
    return WindowManager.getInstance().getPreferenceWindow();
  }
  if (windowName === 'clipboardHistoryWindow') {
    return WindowManager.getInstance().getClipboardHistoryWindow();
  }
  if (windowName === 'largeTextWindow') {
    return WindowManager.getInstance().getLargeTextWindow();
  }

  throw new Error(`Window name is not properly set up:\n${windowName}`);
};
