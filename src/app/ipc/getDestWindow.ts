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
  throw new Error(`Window name is not properly set up:\n${windowName}`);
};
