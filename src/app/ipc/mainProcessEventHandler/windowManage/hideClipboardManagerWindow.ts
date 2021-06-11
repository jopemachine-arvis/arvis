import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideClipboardManagerWindow = (e: IpcMainEvent) => {
  WindowManager.getInstance().getClipboardManagerWindow().hide();
};
