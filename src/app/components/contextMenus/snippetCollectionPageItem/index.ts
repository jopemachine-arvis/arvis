import { dialog, Menu, MenuItem } from 'electron';
import _ from 'lodash';
import open from 'open';
import { WindowManager } from '../../../windows/windowManager';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';

type SnippetCollectionItem = {
  collectionName: string;
  collectionPath: string;
};

class SnippetCollectionContextMenu extends Menu {
  constructor(items: SnippetCollectionItem[]) {
    super();
    if (items.length === 1) {
      const targetItem = items[0];

      super.append(
        new MenuItem({
          type: 'normal',
          label: `Delete`,
          toolTip: 'Uninstall selected snippet collection',
          click() {
            dialog
              .showMessageBox({
                type: 'info',
                buttons: ['ok', 'cancel'],
                message: `Are you sure you want to delete '${targetItem.collectionName}'?`,
              })
              .then((ret) => {
                const yesPressed = ret.response === 0;
                WindowManager.getInstance()
                  .getPreferenceWindow()
                  .webContents.send(IPCMainEnum.openYesnoDialogRet, {
                    yesPressed,
                  });
                return null;
              })
              .catch(console.error);
          },
        })
      );
      super.append(new MenuItem({ type: 'separator' }));
      super.append(
        new MenuItem({
          type: 'normal',
          label:
            process.platform === 'darwin'
              ? 'Open in Finder'
              : `Open in Explorer`,
          toolTip:
            'Opens the installation path of the selected snippet collection with Explorer',
          click() {
            open(targetItem.collectionPath);
          },
        })
      );
    } else {
      //
    }
  }
}

export default SnippetCollectionContextMenu;
