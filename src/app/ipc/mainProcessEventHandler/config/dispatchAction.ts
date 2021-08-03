import { IpcMainEvent } from 'electron';
import { getDestWindow } from '../../getDestWindow';
import { IPCMainEnum } from '../../ipcEventEnum';

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
    destWindow,
    actionType,
    args,
  }: {
    destWindow: string;
    actionType: string;
    args: any;
  }
) => {
  getDestWindow(destWindow).webContents.send(IPCMainEnum.fetchAction, {
    actionType,
    args,
  });
};
