import { IpcMainEvent } from 'electron';
import toggleWindow from '../../toggleClipboardHistoryWindow';

/**
 */
export const toggleClipboardHistoryWindow = (e: IpcMainEvent) => {
  toggleWindow({ showsUp: false });
};
