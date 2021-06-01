import { IpcMainEvent } from 'electron';
import { stopFileWatcher } from '../../../helper/fileWatcher';

/**
 * @summary Used to get all system fonts
 */
export const stopFileWatch = (e: IpcMainEvent) => {
  stopFileWatcher();
};
