import { IpcMainEvent } from 'electron';
import toggleWindow from '../../../windows/utils/toggleClipboardHistoryWindow';

/**
 */
export const toggleClipboardHistoryWindow = (e: IpcMainEvent) => {
  toggleWindow({ showsUp: false });
};
