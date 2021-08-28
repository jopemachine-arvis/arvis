import { BrowserWindow } from 'electron';
import { WindowManager } from '..';

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
    return WindowManager.getInstance().getAssistanceWindow();
  }
  if (windowName === 'largeTextWindow') {
    return WindowManager.getInstance().getLargeTextWindow();
  }

  throw new Error(`Window name is not properly set up:\n${windowName}`);
};
