import { WindowManager } from '../../../windows';

export default ({ showsUp }: { showsUp?: boolean }) => {
  const clipboardManagerWindow =
    WindowManager.getInstance().getClipboardManagerWindow();

  if (!showsUp && clipboardManagerWindow.isVisible()) {
    clipboardManagerWindow.hide();
  } else {
    // Center the window and set y position.
    clipboardManagerWindow.center();
    clipboardManagerWindow.show();
    clipboardManagerWindow.focus();
  }
};
