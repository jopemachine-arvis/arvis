import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideClipboardHistoryWindow = (e: IpcMainEvent) => {
  WindowManager.getInstance().getClipboardHistoryWindow().hide();
};
