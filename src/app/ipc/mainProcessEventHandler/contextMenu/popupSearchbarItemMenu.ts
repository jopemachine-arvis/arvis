import { IpcMainEvent } from 'electron';
import { SearchbarContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 */
export const popupSearchbarItemMenu = (
  e: IpcMainEvent,
  { isPinned }: { isPinned: boolean }
) => {
  new SearchbarContextMenu({ isPinned }).popup();
};
