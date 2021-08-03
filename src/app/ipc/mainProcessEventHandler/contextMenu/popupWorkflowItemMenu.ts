import { IpcMainEvent } from 'electron';
import { WorkflowItemContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 * @param path
 */
export const popupWorkflowItemMenu = (
  e: IpcMainEvent,
  { items }: { items: string }
) => {
  new WorkflowItemContextMenu(JSON.parse(items) as any[]).popup();
};
