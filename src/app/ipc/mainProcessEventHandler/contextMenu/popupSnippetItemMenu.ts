import { IpcMainEvent } from 'electron';
import { SnippetItemContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 */
export const popupSnippetItemMenu = (
  e: IpcMainEvent,
  { snippetItemStr }: { snippetItemStr: string }
) => {
  new SnippetItemContextMenu({ snippet: JSON.parse(snippetItemStr) }).popup();
};
