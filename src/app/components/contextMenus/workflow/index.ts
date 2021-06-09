/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-loop-func */
import { dialog, Menu, MenuItem } from 'electron';
import open from 'open';
import path from 'path';
import _ from 'lodash';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';
import { WindowManager } from '../../../windows';

type WorkflowItem = {
  workflowPath: string;
  workflowEnabled: boolean;
};

class WorkflowItemContextMenu extends Menu {
  constructor(items: WorkflowItem[]) {
    super();
    if (items.length === 1) {
      const targetItem = items[0];
      const bundleId = targetItem.workflowPath.split(path.sep).pop();

      super.append(
        new MenuItem({
          type: 'normal',
          label: targetItem.workflowEnabled ? `Disable` : 'Enable',
          toolTip: targetItem.workflowEnabled
            ? 'Disable selected workflow'
            : 'Enable selected workflow',
          click() {
            WindowManager.getInstance()
              .getPreferenceWindow()
              .webContents.send(IPCMainEnum.toggleWorkflowsEnabled, {
                bundleIds: JSON.stringify([bundleId]),
                enabled: targetItem.workflowEnabled,
              });
          },
        })
      );
      super.append(new MenuItem({ type: 'separator' }));
      super.append(
        new MenuItem({
          type: 'normal',
          label: `Delete`,
          toolTip: 'Uninstall selected workflow',
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
            'Opens the installation path of the selected workflow with Explorer',
          click() {
            open(targetItem.workflowPath);
          },
        })
      );
      super.append(
        new MenuItem({
          type: 'normal',
          label: 'Open arvis-workflow.json',
          toolTip: 'Open arvis-workflow.json of the selected workflow',
          click() {
            open(`${targetItem.workflowPath}${path.sep}arvis-workflow.json`);
          },
        })
      );
    } else {
      const allEnabled =
        _.filter(items, (targetItem) => targetItem.workflowEnabled === true)
          .length === items.length;

      const allDisabled =
        _.filter(items, (targetItem) => targetItem.workflowEnabled === false)
          .length === items.length;

      if (allEnabled || allDisabled) {
        super.append(
          new MenuItem({
            type: 'normal',
            label: allEnabled
              ? `Disable ${items.length} workflows`
              : `Enable ${items.length} workflows`,

            toolTip: allEnabled
              ? `Disable ${items.length} workflows`
              : `Enable ${items.length} workflows`,
            click() {
              const bundleIds = items.map((item: WorkflowItem) =>
                item.workflowPath.split(path.sep).pop()
              );

              WindowManager.getInstance()
                .getPreferenceWindow()
                .webContents.send(IPCMainEnum.toggleWorkflowsEnabled, {
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

export default WorkflowItemContextMenu;
