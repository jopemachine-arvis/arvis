import { IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../ipcEventEnum';
import { WindowManager } from '../../windows/windowManager';

/**
 * @summary
 */
export const triggerKeyDownEvent = (
  e: IpcMainEvent,
  { keycombo }: { keycombo: string }
) => {
  console.error('Not implemented yet!');

  WindowManager.getInstance()
    .getSearchWindow()
    .webContents.send(IPCMainEnum.triggerKeyDownEvent, { keycombo });
};
