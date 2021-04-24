import { BrowserWindow } from 'electron';

export default function ShortcutCallbackTableGenerator({
  searchWindow
}: {
  searchWindow: BrowserWindow;
}) {
  return {
    showSearchWindow: () => {
      if (!searchWindow) {
        throw new Error('"searchWindow" is not defined');
      }

      searchWindow.show();
      searchWindow.focus();
    }
  };
}
