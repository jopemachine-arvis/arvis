import { IpcMainEvent } from 'electron';
import { WorkflowPageItemContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 */
export const popupWorkflowItemMenu = (
  e: IpcMainEvent,
  { items }: { items: string }
) => {
  new WorkflowPageItemContextMenu(JSON.parse(items) as any[]).popup();
};
