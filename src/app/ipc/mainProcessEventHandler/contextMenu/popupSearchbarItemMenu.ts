import { IpcMainEvent } from 'electron';
import { SearchbarContextMenu } from '../../../components/contextMenus';

/**
 * @param path
 * @summary Used to popup context menu
 */
export const popupSearchbarItemMenu = (
  e: IpcMainEvent,
  { isPinned }: { isPinned: boolean }
) => {
  new SearchbarContextMenu({ isPinned }).popup();
};
