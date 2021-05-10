import { BrowserWindow } from 'electron';

export default ({
  searchWindow,
  itemCount,
  maxItemCount,
  itemHeight,
  searchbarHeight,
  footerHeight
}: {
  searchWindow: BrowserWindow;
  itemCount: number;
  maxItemCount: number;
  itemHeight: number;
  searchbarHeight: number;
  footerHeight: number;
}) => {
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
