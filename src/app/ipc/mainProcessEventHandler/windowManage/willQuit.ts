import { IpcMainEvent } from 'electron';
import { quitArvis } from '../../../helper/quitArvis';

/**
 */
export const willQuitRet = (e: IpcMainEvent) => {
  quitArvis();
};
