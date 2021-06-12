import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';
import { hideWindowAndRestoreFocus } from '../../../utils';
/**
 * @summary
 */
export const hideClipboardHistoryWindow = (e: IpcMainEvent) => {
  hideWindowAndRestoreFocus(
    WindowManager.getInstance().getClipboardHistoryWindow()
  );
};
