import { IpcMainEvent } from 'electron';
import toggleWindow from '../../toggleSearchWindow';

/**
 */
export const toggleSearchWindow = (e: IpcMainEvent) => {
  toggleWindow({ showsUp: false });
};
