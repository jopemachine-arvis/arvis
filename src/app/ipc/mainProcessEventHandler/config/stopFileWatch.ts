import { IpcMainEvent } from 'electron';
import { stopFileWatcher } from '../../../helper/fileWatcher';

/**
 */
export const stopFileWatch = (e: IpcMainEvent) => {
  stopFileWatcher();
};
