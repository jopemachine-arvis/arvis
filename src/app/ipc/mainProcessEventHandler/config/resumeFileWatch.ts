import { IpcMainEvent } from 'electron';
import { startFileWatcher } from '../../../helper/fileWatcher';

/**
 */
export const resumeFileWatch = (e: IpcMainEvent) => {
  startFileWatcher();
};
