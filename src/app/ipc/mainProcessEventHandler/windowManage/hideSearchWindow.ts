import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 */
export const hideSearchWindow = (e: IpcMainEvent) => {
  // Bug:: On Windows, below function cause not showing search window bug.
  // hideWindowAndRestoreFocus(WindowManager.getInstance().getSearchWindow());
  WindowManager.getInstance().getSearchWindow().hide();
};
