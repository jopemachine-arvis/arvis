import { IpcMainEvent } from 'electron';
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
    windowWidth,
    itemCount,
    maxItemCount,
    itemHeight,
    searchbarHeight,
    footerHeight,
  }: {
    windowWidth: number;
    itemCount: number;
    maxItemCount: number;
    itemHeight: number;
    searchbarHeight: number;
    footerHeight: number;
  }
) => {
  resizeEventHandler({
    windowWidth,
    footerHeight,
    itemCount,
    itemHeight,
    maxItemCount,
    searchbarHeight,
  });
};
