import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @summary
 */
export const hideQuicklookWindow = (e: IpcMainEvent) => {
  WindowManager.getInstance().getQuicklookWindow().hide();

  if (WindowManager.getInstance().getSearchWindow().isVisible()) {
    WindowManager.getInstance().getSearchWindow().focus();
  }
};
