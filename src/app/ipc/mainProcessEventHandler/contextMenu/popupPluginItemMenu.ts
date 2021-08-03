import { IpcMainEvent } from 'electron';
import { PluginItemContextMenu } from '../../../components/contextMenus';

/**
 * Used to popup context menu
 * @param path
 */
export const popupPluginItemMenu = (
  e: IpcMainEvent,
  { items }: { items: string }
) => {
  new PluginItemContextMenu(JSON.parse(items) as any[]).popup();
};
