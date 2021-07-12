import { Core } from 'arvis-core';
import dotProp from 'dot-prop';
import { Menu, MenuItem } from 'electron';
import fse from 'fs-extra';
import { WindowManager } from '../../../windows/windowManager';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';

class WorkflowTriggerTableItemContextMenu extends Menu {
  constructor({
    bundleId,
    triggerPath,
    workflowInfo,
  }: {
    bundleId: string;
    triggerPath: string;
    workflowInfo: any;
  }) {
    super();

    const targetTrigger: any = dotProp.get(workflowInfo, triggerPath);

    const hasParentTrigger: any =
      triggerPath.split('.').slice(0, -1).join('.') !== 'commands';

    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Assign hotkey',
        toolTip: 'Assign hotkey',
        enabled: targetTrigger.type !== 'hotkey' && !hasParentTrigger,
        click() {
          const { commands } = workflowInfo;

          const targetTriggerIdx = commands.indexOf(targetTrigger);
          commands[targetTriggerIdx] = {
            type: 'hotkey',
            hotkey: '',
            actions: [targetTrigger],
          };

          workflowInfo.bundleId = undefined;
          workflowInfo.commands = commands;

          fse
            .writeJSON(
              Core.path.getWorkflowConfigJsonPath(bundleId),
              workflowInfo,
              {
                encoding: 'utf-8',
                spaces: 4,
              }
            )
            .then(() => {
              WindowManager.getInstance()
                .getPreferenceWindow()
                .webContents.send(IPCMainEnum.reloadWorkflow, { bundleId });
              WindowManager.getInstance()
                .getSearchWindow()
                .webContents.send(IPCMainEnum.reloadWorkflow, { bundleId });
              return null;
            })
            .catch(console.error);
        },
      })
    );
  }
}

export default WorkflowTriggerTableItemContextMenu;
