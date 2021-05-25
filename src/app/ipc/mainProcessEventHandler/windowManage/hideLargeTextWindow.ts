import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideLargeTextWindow = (e: IpcMainEvent) => {
  WindowManager.getInstance().getLargeTextWindow().hide();
};
