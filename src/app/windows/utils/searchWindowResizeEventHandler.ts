import { WindowManager } from '../windowManager';

/**
 * @param windowWidth
 * @param itemCount
 * @param maxItemCount
 * @param itemHeight
 * @param searchbarHeight
 * @param footerHeight
 * @param forceMaxHeight
 */
export default ({
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
}) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();

  if (searchWindow.isDestroyed()) return;

  const [currentWidth, currentHeight] = searchWindow.getSize();

  let heightToSet;
  let shouldResize = true;

  if (itemCount === 0) {
    heightToSet = searchbarHeight;
  } else if (itemCount >= maxItemCount || forceMaxHeight) {
    heightToSet = maxItemCount * itemHeight + searchbarHeight + footerHeight;
    if (currentHeight >= heightToSet) shouldResize = false;
  } else {
    heightToSet = itemCount * itemHeight + searchbarHeight + footerHeight;
  }

  if (shouldResize) {
    searchWindow.setBounds({ width: windowWidth, height: heightToSet }, false);
  }
};
