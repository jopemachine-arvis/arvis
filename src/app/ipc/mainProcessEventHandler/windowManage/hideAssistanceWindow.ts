import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';
import { hideWindowAndRestoreFocus } from '../../../utils';

/**
 */
export const hideAssistanceWindow = (e: IpcMainEvent) => {
  hideWindowAndRestoreFocus(WindowManager.getInstance().getAssistanceWindow());
};
