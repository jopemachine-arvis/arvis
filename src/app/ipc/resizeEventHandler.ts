import { BrowserWindow } from 'electron';

/**
 * @param  {BrowserWindow} searchWindow
 * @param  {number} itemCount
 * @param  {number} maxItemCount
 * @param  {number} itemHeight
 * @param  {number} searchbarHeight
 * @param  {number} footerHeight
 */
export default ({
  searchWindow,
  itemCount,
  maxItemCount,
  itemHeight,
  searchbarHeight,
  footerHeight,
}: {
  searchWindow: BrowserWindow;
  itemCount: number;
  maxItemCount: number;
  itemHeight: number;
  searchbarHeight: number;
  footerHeight: number;
}) => {
  if (searchWindow.isDestroyed()) return;

  let heightToSet;

  if (itemCount === 0) {
    heightToSet = searchbarHeight;
  } else if (itemCount >= maxItemCount) {
    heightToSet = maxItemCount * itemHeight + searchbarHeight + footerHeight;
  } else {
    heightToSet = itemCount * itemHeight + searchbarHeight + footerHeight;
  }

  const [width] = searchWindow.getSize();

  searchWindow.setSize(width, heightToSet);
};