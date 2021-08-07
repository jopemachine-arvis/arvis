import { WindowManager } from '../windowManager';

/**
 * @param windowWidth
 * @param itemCount
 * @param maxItemCount
 * @param itemHeight
 * @param searchbarHeight
 * @param footerHeight
 */
export default ({
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
}) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();

  if (searchWindow.isDestroyed()) return;

  let heightToSet;

  if (itemCount === 0) {
    heightToSet = searchbarHeight;
  } else {
    heightToSet = maxItemCount * itemHeight + searchbarHeight + footerHeight;
  }

  searchWindow.setBounds({ width: windowWidth, height: heightToSet }, false);
};
