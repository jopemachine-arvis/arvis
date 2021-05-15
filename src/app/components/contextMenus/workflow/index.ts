import { BrowserWindow, dialog, Menu, MenuItem } from 'electron';
import open from 'open';
import path from 'path';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';

class WorkflowItemContextMenu extends Menu {
  constructor({
    workflowPath,
    workflowEnabled,
    preferenceWindow,
  }: {
    workflowPath: string;
    workflowEnabled: boolean;
    preferenceWindow: BrowserWindow;
  }) {
    super();
    const bundleId = workflowPath.split(path.sep).pop();

    super.append(
      new MenuItem({
        type: 'normal',
        label: workflowEnabled ? `Disable workflow` : 'Enable workflow',
        toolTip: workflowEnabled
          ? 'Disable selected workflow'
          : 'Enable workflow',
        click() {
          preferenceWindow.webContents.send(IPCMainEnum.toggleWorkflowEnabled, {
            bundleId,
            workflowEnabled,
          });
        },
      })
    );
    super.append(new MenuItem({ type: 'separator' }));
    super.append(
      new MenuItem({
        type: 'normal',
        label: `Uninstall workflow`,
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
              preferenceWindow.webContents.send(
                IPCMainEnum.openYesnoDialogRet,
                {
                  yesPressed,
                }
              );
            });
        },
      })
    );
    super.append(
      new MenuItem({
        type: 'normal',
        label: `Open workflow's directory`,
        toolTip:
          'Opens the installation path of the selected workflow with Explorer',
        click() {
          open(workflowPath);
        },
      })
    );
  }
}

export default WorkflowItemContextMenu;
