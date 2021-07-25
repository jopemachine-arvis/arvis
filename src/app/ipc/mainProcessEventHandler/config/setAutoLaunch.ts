/* eslint-disable promise/catch-or-return */
import { IpcMainEvent } from 'electron';
import autoLauncher from '../../../config/autoLaunch';

/**
 * @param autoLaunch
 * @summary Used to set autolaunch
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
