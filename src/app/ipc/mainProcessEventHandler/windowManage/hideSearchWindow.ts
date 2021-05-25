import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideSearchWindow = async (e: IpcMainEvent) => {
  WindowManager.getInstance().getSearchWindow().hide();
};
