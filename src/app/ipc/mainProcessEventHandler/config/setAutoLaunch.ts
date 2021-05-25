import { IpcMainEvent } from 'electron';
import autoLauncher from '../../../config/autoLaunch';

/**
 * @param  {boolean} autoLaunch
 * @summary Used to set autolaunch
 */
export const setAutoLaunch = (
  e: IpcMainEvent,
  { autoLaunch }: { autoLaunch: boolean }
) => {
  if (autoLaunch) {
    autoLauncher.enable();
  } else {
    autoLauncher.disable();
  }
};
