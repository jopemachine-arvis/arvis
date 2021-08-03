import { IpcMainEvent } from 'electron';
import { PluginPageItemContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 * @param path
 */
export const popupPluginItemMenu = (
  e: IpcMainEvent,
  { items }: { items: string }
) => {
  new PluginPageItemContextMenu(JSON.parse(items) as any[]).popup();
};
