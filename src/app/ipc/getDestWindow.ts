import { BrowserWindow } from 'electron';
import { WindowManager } from '../windows';

/**
 * @param  {string} windowName
 * @return {BrowserWindow}
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
  if (windowName === 'quicklookWindow') {
    return WindowManager.getInstance().getQuicklookWindow();
  }

  throw new Error(`Window name is not properly set up:\n${windowName}`);
};
