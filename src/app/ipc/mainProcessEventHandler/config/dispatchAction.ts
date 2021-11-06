import { IpcMainEvent } from 'electron';
import { IPCMainEnum } from '../../ipcEventEnum';
import { getDestWindow } from '../../../windows/utils/getDestWindow';
import { WindowManager } from '../../../windows/windowManager';

/**
 * When some action is dispatched from some window, the action is not dispatched to other windows.
 * So, therefore, this function should be used to dispatch to target windows via ipc.
 * @param destWindow
 * @param actionType
 * @param args
 */
export const dispatchAction = (
  e: IpcMainEvent,
  {
    actionType,
    args,
    destWindow,
  }: {
    actionType: string;
    args: any;
    destWindow?: string;
  }
) => {
  if (destWindow) {
    getDestWindow(destWindow).webContents.send(IPCMainEnum.fetchAction, {
      actionType,
      args,
    });
  } else {
    WindowManager.getInstance()
      .getAllWindows()
      .forEach((window) => {
        window.webContents.send(IPCMainEnum.fetchAction, {
          actionType,
          args,
        });
      });
  }
};
