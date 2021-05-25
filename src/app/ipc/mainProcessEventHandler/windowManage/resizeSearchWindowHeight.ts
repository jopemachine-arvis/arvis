import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';
import resizeEventHandler from '../../resizeEventHandler';

/**
 * @param {number} itemCount
 * @param {number} maxItemCount
 * @param {number} itemHeight
 * @param {number} searchbarHeight
 * @param {number} footerHeight
 * @summary Used to automatically change the height of searchWindow
 */
export const resizeSearchWindowHeight = (
  e: IpcMainEvent,
  {
    itemCount,
    maxItemCount,
    itemHeight,
    searchbarHeight,
    footerHeight,
  }: {
    itemCount: number;
    maxItemCount: number;
    itemHeight: number;
    searchbarHeight: number;
    footerHeight: number;
  }
) => {
  resizeEventHandler({
    footerHeight,
    itemCount,
    itemHeight,
    maxItemCount,
    searchbarHeight,
    searchWindow: WindowManager.getInstance().getSearchWindow(),
  });
};
