import { dialog, Menu, MenuItem } from 'electron';
import open from 'open';
import path from 'path';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';
import { WindowManager } from '../../../windows';

class WorkflowItemContextMenu extends Menu {
  constructor({
    workflowPath,
    workflowEnabled,
  }: {
    workflowPath: string;
    workflowEnabled: boolean;
  }) {
    super();
    const bundleId = workflowPath.split(path.sep).pop();

    super.append(
      new MenuItem({
        type: 'normal',
        label: workflowEnabled ? `Disable` : 'Enable',
        toolTip: workflowEnabled
          ? 'Disable selected workflow'
          : 'Enable workflow',
        click() {
          WindowManager.getInstance()
            .getPreferenceWindow()
            .webContents.send(IPCMainEnum.toggleWorkflowEnabled, {
              bundleId,
              enabled: workflowEnabled,
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
          process.platform === 'darwin' ? 'Open in Finder' : `Open in Explorer`,
        toolTip:
          'Opens the installation path of the selected workflow with Explorer',
        click() {
          open(workflowPath);
        },
      })
    );
    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Open arvis-workflow.json',
        toolTip: 'Open arvis-workflow.json of the selected workflow',
        click() {
          open(`${workflowPath}${path.sep}arvis-workflow.json`);
        },
      })
    );
  }
}

export default WorkflowItemContextMenu;
