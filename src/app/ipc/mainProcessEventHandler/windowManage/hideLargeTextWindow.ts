import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideLargeTextWindow = (e: IpcMainEvent) => {
  WindowManager.getInstance().getLargeTextWindow().hide();

  if (WindowManager.getInstance().getSearchWindow().isVisible()) {
    WindowManager.getInstance().getSearchWindow().focus();
  }
};
