import { WindowManager } from '../windows/windowManager';

/**
 * @param  {number} windowWidth
 * @param  {number} itemCount
 * @param  {number} maxItemCount
 * @param  {number} itemHeight
 * @param  {number} searchbarHeight
 * @param  {number} footerHeight
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
  } else if (itemCount >= maxItemCount) {
    heightToSet = maxItemCount * itemHeight + searchbarHeight + footerHeight;
  } else {
    heightToSet = itemCount * itemHeight + searchbarHeight + footerHeight;
  }

  searchWindow.setBounds({ width: windowWidth, height: heightToSet }, false);
};
