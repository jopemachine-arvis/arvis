import { IpcMainEvent } from 'electron';
import resizeEventHandler from '../../../windows/utils/searchWindowResizeEventHandler';

/**
 * Used to automatically change the height of searchWindow
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
    forceMaxHeight,
  }: {
    windowWidth: number;
    itemCount: number;
    maxItemCount: number;
    itemHeight: number;
    searchbarHeight: number;
    footerHeight: number;
    forceMaxHeight: boolean;
  }
) => {
  resizeEventHandler({
    windowWidth,
    footerHeight,
    itemCount,
    itemHeight,
    maxItemCount,
    searchbarHeight,
    forceMaxHeight,
  });
};
