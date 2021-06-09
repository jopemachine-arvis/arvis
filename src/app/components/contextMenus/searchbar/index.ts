import { Menu, MenuItem, app } from 'electron';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';
import { WindowManager } from '../../../windows';

class SearchbarContextMenu extends Menu {
  constructor({ isPinned }: { isPinned: boolean }) {
    super();

    super.append(
      new MenuItem({
        type: 'checkbox',
        label: 'Pin Search Window',
        toolTip: 'Pin Search Window',
        checked: isPinned,
        click() {
          if (!isPinned === true) {
            WindowManager.getInstance()
              .getSearchWindow()
              .setAlwaysOnTop(true, 'floating');
          } else {
            WindowManager.getInstance().getSearchWindow().setAlwaysOnTop(false);
          }

          WindowManager.getInstance()
            .getSearchWindow()
            .webContents.send(IPCMainEnum.pinSearchWindow, {
              bool: !isPinned,
            });
        },
      })
    );
    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Preferences..',
        toolTip: 'Open Preference window',
        click() {
          WindowManager.getInstance().getPreferenceWindow().show();
        },
      })
    );
    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Open Debugger Window',
        toolTip: 'Open Search window Debugger Window',
        click() {
          WindowManager.getInstance()
            .getSearchWindow()
            .webContents.openDevTools({
              mode: 'undocked',
              activate: true,
            });
        },
      })
    );
    super.append(new MenuItem({ type: 'separator' }));
    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Quit',
        toolTip: 'Quit Arvis',
        click() {
          app.quit();
        },
      })
    );
  }
}

export default SearchbarContextMenu;
