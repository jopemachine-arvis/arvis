import { BrowserWindow, dialog, Menu, MenuItem } from 'electron';
import open from 'open';
import path from 'path';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';

class PluginContextMenu extends Menu {
  constructor({
    pluginPath,
    pluginEnabled,
    preferenceWindow,
  }: {
    pluginPath: string;
    pluginEnabled: boolean;
    preferenceWindow: BrowserWindow;
  }) {
    super();
    const bundleId = pluginPath.split(path.sep).pop();

    super.append(
      new MenuItem({
        type: 'normal',
        label: pluginEnabled ? `Disable` : 'Enable',
        toolTip: pluginEnabled ? 'Disable selected plugin' : 'Enable plugin',
        click() {
          preferenceWindow.webContents.send(IPCMainEnum.togglePluginEnabled, {
            bundleId,
            enabled: pluginEnabled,
          });
        },
      })
    );
    super.append(new MenuItem({ type: 'separator' }));
    super.append(
      new MenuItem({
        type: 'normal',
        label: `Delete`,
        toolTip: 'Uninstall selected plugin',
        click() {
          dialog
            .showMessageBox({
              type: 'info',
              buttons: ['ok', 'cancel'],
              message: `Are you sure you want to delete '${bundleId}'?`,
            })
            .then((ret) => {
              const yesPressed = ret.response === 0;
              preferenceWindow.webContents.send(
                IPCMainEnum.openYesnoDialogRet,
                {
                  yesPressed,
                }
              );
              return null;
            })
            .catch(console.error);
        },
      })
    );
    super.append(
      new MenuItem({
        type: 'normal',
        label:
          process.platform === 'darwin' ? 'Open in Finder' : `Open in Explorer`,
        toolTip:
          'Opens the installation path of the selected plugin with Explorer',
        click() {
          open(pluginPath);
        },
      })
    );
  }
}

export default PluginContextMenu;
