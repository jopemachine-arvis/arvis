import { IpcMainEvent } from 'electron';
import autoLauncher from '../../../config/autoLaunch';

/**
 * Used to set autolaunch
 * @param autoLaunch
 */
export const setAutoLaunch = (
  e: IpcMainEvent,
  { autoLaunch }: { autoLaunch: boolean }
) => {
  if (autoLaunch) {
    autoLauncher
      .enable()
      .then(() => {
        console.log('Enabled auto launching');
        return null;
      })
      .catch(console.error);
  } else {
    autoLauncher
      .disable()
      .then(() => {
        console.log('Disabled auto launching');
        return null;
      })
      .catch(console.error);
  }
};
