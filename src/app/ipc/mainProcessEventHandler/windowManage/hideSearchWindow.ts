import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideSearchWindow = (e: IpcMainEvent) => {
  console.log('hideWindowAndRestoreFocus');
  // Bug:: On Windows, below function cause not showing search window bug.
  // hideWindowAndRestoreFocus(WindowManager.getInstance().getSearchWindow());
  WindowManager.getInstance().getSearchWindow().hide();
};
