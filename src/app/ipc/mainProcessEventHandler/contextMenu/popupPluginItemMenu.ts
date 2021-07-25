import { IpcMainEvent } from 'electron';
import { PluginItemContextMenu } from '../../../components/contextMenus';

/**
 * @param path
 * @summary Used to popup context menu
 */
export const popupPluginItemMenu = (
  e: IpcMainEvent,
  { items }: { items: string }
) => {
  new PluginItemContextMenu(JSON.parse(items) as any[]).popup();
};
