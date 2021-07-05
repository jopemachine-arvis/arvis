import { screen } from 'electron';
import { WindowManager } from '../windows';

export default ({ showsUp }: { showsUp?: boolean }) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();

  if (!showsUp && searchWindow.isVisible()) {
    searchWindow.hide();
  } else {
    // Center the window and set y position.
    searchWindow.center();
    const [x] = searchWindow.getPosition();
    const { height } = screen.getPrimaryDisplay().size;

    const [width] = searchWindow.getSize();
    searchWindow.setBounds({ width: 1 }, false);

    // To remove afterimage, move window to unseen position and show
    searchWindow.setPosition(99999, 99999);
    searchWindow.show();

    setTimeout(() => {
      searchWindow.setBounds({ width }, false);
      searchWindow.setPosition(x, Math.round(height / 8));
      searchWindow.focus();
    }, 150);
  }
};
