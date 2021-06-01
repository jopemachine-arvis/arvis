import { IpcMainEvent } from 'electron';
import { startFileWatcher } from '../../../helper/fileWatcher';

/**
 * @summary Used to get all system fonts
 */
export const resumeFileWatch = (e: IpcMainEvent) => {
  startFileWatcher();
};
