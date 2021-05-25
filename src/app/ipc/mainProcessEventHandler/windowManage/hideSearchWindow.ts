import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideSearchWindow = (e: IpcMainEvent) => {
  WindowManager.getInstance().getSearchWindow().hide();
};
