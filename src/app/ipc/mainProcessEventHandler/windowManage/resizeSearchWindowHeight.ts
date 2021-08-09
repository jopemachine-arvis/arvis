import { IpcMainEvent } from 'electron';
import resizeEventHandler from '../../../windows/utils/searchWindowResizeEventHandler';

/**
 * Used to automatically change the height of searchWindow
 * @param windowWidth
 * @param itemCount
 * @param maxItemCount
 * @param itemHeight
 * @param searchbarHeight
 * @param footerHeight
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
