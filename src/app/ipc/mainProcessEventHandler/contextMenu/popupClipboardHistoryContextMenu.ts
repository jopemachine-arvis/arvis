import { IpcMainEvent } from 'electron';
import { ClipboardHistoryWindowContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 * @param path
 */
export const popupClipboardHistoryContextMenu = (
  e: IpcMainEvent,
  { isPinned }: { isPinned: boolean }
) => {
  new ClipboardHistoryWindowContextMenu({ isPinned }).popup();
};
