import { IpcMainEvent } from 'electron';
import toggleWindow from '../../../windows/utils/toggleSearchWindow';

/**
 */
export const toggleSearchWindow = (
  e: IpcMainEvent,
  { showsUp, command }: { showsUp?: boolean; command?: string }
) => {
  toggleWindow({ showsUp: showsUp ?? false, command });
};
