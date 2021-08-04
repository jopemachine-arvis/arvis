import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 */
export const hideSearchWindow = (e: IpcMainEvent) => {
  // hideWindowAndRestoreFocus have problem on mac, windows.
  // On Windows, not shows search window
  // On Mac, also hide preference window (side effect)
  // So hideWindowAndRestoreFocus is used in only clipboard history window now.

  // hideWindowAndRestoreFocus(WindowManager.getInstance().getSearchWindow());
  WindowManager.getInstance().getSearchWindow().hide();
};
