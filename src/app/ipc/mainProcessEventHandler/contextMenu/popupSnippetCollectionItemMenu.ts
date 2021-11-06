import { IpcMainEvent } from 'electron';
import { SnippetPageItemContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 */
export const popupSnippetCollectionItemMenu = (
  e: IpcMainEvent,
  { items }: { items: string }
) => {
  new SnippetPageItemContextMenu(JSON.parse(items) as any[]).popup();
};
