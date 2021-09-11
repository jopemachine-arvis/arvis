import { IpcMainEvent } from 'electron';
import { registerWorkflowHotkeys as registerHotkeys } from '../../../config/shortcuts/globalShortcutHandler';

/**
 */
export const registerWorkflowHotkeys = (
  e: IpcMainEvent,
  { hotkeys }: { hotkeys: string }
) => {
  registerHotkeys(JSON.parse(hotkeys));
};
