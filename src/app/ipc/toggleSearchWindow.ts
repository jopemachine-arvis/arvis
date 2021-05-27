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
    searchWindow.setPosition(x, Math.round(height / 8));
    searchWindow.show();
    searchWindow.focus();
  }
};
