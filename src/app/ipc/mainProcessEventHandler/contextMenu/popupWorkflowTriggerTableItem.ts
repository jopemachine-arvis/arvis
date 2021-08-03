import { IpcMainEvent } from 'electron';
import { WorkflowTriggerTableItemContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 * @param path
 */
export const popupWorkflowTriggerTableItem = (
  e: IpcMainEvent,
  {
    bundleId,
    triggerPath,
    workflowInfo,
  }: { bundleId: string; triggerPath: string; workflowInfo: string }
) => {
  new WorkflowTriggerTableItemContextMenu({
    bundleId,
    triggerPath,
    workflowInfo: JSON.parse(workflowInfo),
  }).popup();
};
