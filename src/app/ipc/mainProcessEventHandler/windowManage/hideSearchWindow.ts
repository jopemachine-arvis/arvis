import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';
import { hideWindowAndRestoreFocus } from '../../../utils';

/**
 * @summary
 */
export const hideSearchWindow = (e: IpcMainEvent) => {
  hideWindowAndRestoreFocus(WindowManager.getInstance().getSearchWindow());
};
