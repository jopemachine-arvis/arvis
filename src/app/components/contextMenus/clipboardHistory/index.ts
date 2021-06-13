import { Menu, MenuItem } from 'electron';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';
import { WindowManager } from '../../../windows';

class ClipboardHistoryContextMenu extends Menu {
  constructor({ isPinned }: { isPinned: boolean }) {
    super();

    super.append(
      new MenuItem({
        type: 'checkbox',
        label: 'Pin Clipboard History Window',
        toolTip: 'Pin Clipboard History Window',
        checked: isPinned,
        click() {
          const blurEventHandler = WindowManager.getEventHandler(
            'clipboardHistoryWindow',
            'blur'
          ) as () => void;

          if (!isPinned === true) {
            WindowManager.getInstance()
              .getClipboardHistoryWindow()
              .setAlwaysOnTop(true, 'floating');

            WindowManager.getInstance()
              .getClipboardHistoryWindow()
              .off('blur', blurEventHandler);
          } else {
            WindowManager.getInstance()
              .getClipboardHistoryWindow()
              .setAlwaysOnTop(false);
            WindowManager.getInstance()
              .getClipboardHistoryWindow()
              .on('blur', blurEventHandler);
          }

          WindowManager.getInstance()
            .getClipboardHistoryWindow()
            .webContents.send(IPCMainEnum.pinClipboardHistoryWindow, {
              bool: !isPinned,
            });
        },
      })
    );
  }
}

export default ClipboardHistoryContextMenu;
