import { dialog, Menu, MenuItem } from 'electron';
import open from 'open';
import path from 'path';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';
import { WindowManager } from '../../../windows';

class PluginContextMenu extends Menu {
  constructor({
    pluginPath,
    pluginEnabled,
  }: {
    pluginPath: string;
    pluginEnabled: boolean;
  }) {
    super();
    const bundleId = pluginPath.split(path.sep).pop();

    super.append(
      new MenuItem({
        type: 'normal',
        label: pluginEnabled ? `Disable` : 'Enable',
        toolTip: pluginEnabled ? 'Disable selected plugin' : 'Enable plugin',
        click() {
          WindowManager.getInstance()
            .getPreferenceWindow()
            .webContents.send(IPCMainEnum.togglePluginEnabled, {
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
    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Open arvis-plugin.json',
        toolTip: 'Open arvis-plugin.json of the selected plugin',
        click() {
          open(`${pluginPath}${path.sep}arvis-plugin.json`);
        },
      })
    );
  }
}

export default PluginContextMenu;
