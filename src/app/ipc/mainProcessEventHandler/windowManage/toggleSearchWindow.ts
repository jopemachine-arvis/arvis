import { IpcMainEvent } from 'electron';
import toggleWindow from '../../../windows/utils/toggleSearchWindow';

/**
 */
export const toggleSearchWindow = (
  e: IpcMainEvent,
  { showsUp }: { showsUp?: boolean }
) => {
  toggleWindow({ showsUp: showsUp ?? false });
};
