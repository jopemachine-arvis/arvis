import { IpcMainEvent } from 'electron';
import { PluginItemContextMenu } from '../../../components/contextMenus';

/**
 * @param  {string} path
 * @summary Used to popup context menu
 */
export const popupPluginItemMenu = (
  e: IpcMainEvent,
  { pluginPath, pluginEnabled }: { pluginPath: string; pluginEnabled: boolean }
) => {
  new PluginItemContextMenu({
    pluginPath,
    pluginEnabled,
  }).popup();
};
