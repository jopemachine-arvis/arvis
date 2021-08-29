import { Menu, MenuItem } from 'electron';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';
import { WindowManager } from '../../../windows';

class AssistanceWindowContextMenu extends Menu {
  constructor({ isPinned }: { isPinned: boolean }) {
    super();

    super.append(
      new MenuItem({
        type: 'checkbox',
        label: 'Pin Window',
        toolTip: 'Pin Window',
        checked: isPinned,
        click() {
          const blurEventHandler = WindowManager.getEventHandler(
            'assistanceWindow',
            'blur'
          ) as () => void;

          if (!isPinned === true) {
            WindowManager.getInstance()
              .getAssistanceWindow()
              .setAlwaysOnTop(true, 'floating');

            WindowManager.getInstance()
              .getAssistanceWindow()
              .off('blur', blurEventHandler);
          } else {
            WindowManager.getInstance()
              .getAssistanceWindow()
              .setAlwaysOnTop(false);

            WindowManager.getInstance()
              .getAssistanceWindow()
              .on('blur', blurEventHandler);
          }

          WindowManager.getInstance()
            .getAssistanceWindow()
            .webContents.send(IPCMainEnum.pinAssistanceWindow, {
              bool: !isPinned,
            });
        },
      })
    );
  }
}

export default AssistanceWindowContextMenu;
