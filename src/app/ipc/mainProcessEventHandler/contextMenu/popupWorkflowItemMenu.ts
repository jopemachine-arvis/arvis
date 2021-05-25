import { IpcMainEvent } from 'electron';
import { WorkflowItemContextMenu } from '../../../components/contextMenus';

/**
 * @param  {string} path
 * @summary Used to popup context menu
 */
export const popupWorkflowItemMenu = (
  e: IpcMainEvent,
  {
    workflowPath,
    workflowEnabled,
  }: { workflowPath: string; workflowEnabled: boolean }
) => {
  new WorkflowItemContextMenu({
    workflowPath,
    workflowEnabled,
  }).popup();
};
