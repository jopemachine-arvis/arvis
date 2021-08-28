import { IpcMainEvent } from 'electron';
import { AssistanceWindowContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 */
export const popupAssistanceWindowContextMenu = (
  e: IpcMainEvent,
  { isPinned }: { isPinned: boolean }
) => {
  new AssistanceWindowContextMenu({ isPinned }).popup();
};
