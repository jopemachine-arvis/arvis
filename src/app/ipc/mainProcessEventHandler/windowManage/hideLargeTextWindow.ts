import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideLargeTextWindow = async (e: IpcMainEvent) => {
  WindowManager.getInstance().getLargeTextWindow().hide();
};
