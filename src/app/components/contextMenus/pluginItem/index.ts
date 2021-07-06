/* eslint-disable no-restricted-syntax */
import { dialog, Menu, MenuItem } from 'electron';
import _ from 'lodash';
import open from 'open';
import path from 'path';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';
import { WindowManager } from '../../../windows';

type PluginItem = {
  pluginPath: string;
  pluginWebAddress: string;
  pluginEnabled: boolean;
};

class PluginContextMenu extends Menu {
  constructor(items: PluginItem[]) {
    super();
    if (items.length === 1) {
      const targetItem = items[0];
      const bundleId = targetItem.pluginPath.split(path.sep).pop();

      super.append(
        new MenuItem({
          type: 'normal',
          label: targetItem.pluginEnabled ? `Disable` : 'Enable',
          toolTip: targetItem.pluginEnabled
            ? 'Disable selected plugin'
            : 'Enable selected plugin',
          click() {
            WindowManager.getInstance()
              .getPreferenceWindow()
              .webContents.send(IPCMainEnum.togglePluginsEnabled, {
                bundleIds: JSON.stringify([bundleId]),
                enabled: targetItem.pluginEnabled,
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
            process.platform === 'darwin'
              ? 'Open in Finder'
              : `Open in Explorer`,
          toolTip:
            'Opens the installation path of the selected plugin with Explorer',
          click() {
            open(targetItem.pluginPath);
          },
        })
      );
      super.append(
        new MenuItem({
          type: 'normal',
          label: 'Open arvis-plugin.json',
          toolTip: 'Open arvis-plugin.json of the selected plugin',
          click() {
            open(path.resolve(targetItem.pluginPath, 'arvis-plugin.json'));
          },
        })
      );
      super.append(
        new MenuItem({
          type: 'normal',
          label: "Open plugin's web page",
          toolTip: "Open plugin's web page",
          click() {
            open(targetItem.pluginWebAddress);
          },
        })
      );
    } else {
      const allEnabled =
        _.filter(items, (targetItem) => targetItem.pluginEnabled === true)
          .length === items.length;

      const allDisabled =
        _.filter(items, (targetItem) => targetItem.pluginEnabled === false)
          .length === items.length;

      if (allEnabled || allDisabled) {
        super.append(
          new MenuItem({
            type: 'normal',
            label: allEnabled
              ? `Disable ${items.length} plugins`
              : `Enable ${items.length} plugins`,
            toolTip: allEnabled
              ? `Disable ${items.length} plugins`
              : `Enable ${items.length} plugins`,
            click() {
              const bundleIds = items.map((item: PluginItem) =>
                item.pluginPath.split(path.sep).pop()
              );

              WindowManager.getInstance()
                .getPreferenceWindow()
                .webContents.send(IPCMainEnum.togglePluginsEnabled, {
                  bundleIds: JSON.stringify(bundleIds),
                  enabled: allEnabled,
                });
            },
          })
        );
      }
    }
  }
}

export default PluginContextMenu;
