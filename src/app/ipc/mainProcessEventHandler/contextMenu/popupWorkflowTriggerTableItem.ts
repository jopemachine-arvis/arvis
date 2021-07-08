import { IpcMainEvent } from 'electron';
import { WorkflowTriggerTableItemContextMenu } from '../../../components/contextMenus';

/**
 * @param  {string} path
 * @summary Used to popup context menu
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
