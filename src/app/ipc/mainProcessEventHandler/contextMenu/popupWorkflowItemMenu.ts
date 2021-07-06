import { IpcMainEvent } from 'electron';
import { WorkflowItemContextMenu } from '../../../components/contextMenus';

/**
 * @param  {string} path
 * @summary Used to popup context menu
 */
export const popupWorkflowItemMenu = (
  e: IpcMainEvent,
  { items }: { items: string }
) => {
  new WorkflowItemContextMenu(JSON.parse(items) as any[]).popup();
};
