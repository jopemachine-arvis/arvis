import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 */
export const hideLargeTextWindow = (e: IpcMainEvent) => {
  WindowManager.getInstance().getLargeTextWindow().hide();

  if (WindowManager.getInstance().getSearchWindow().isVisible()) {
    WindowManager.getInstance().getSearchWindow().focus();
  } else {
    WindowManager.getInstance().getSearchWindow().hide();
  }
};
