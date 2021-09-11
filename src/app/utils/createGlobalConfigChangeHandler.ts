import { ipcRenderer } from 'electron';
import { Dispatch } from 'react';
import { makeDefaultActionCreator } from './makeActionCreator';
import { IPCRendererEnum } from '../ipc/ipcEventEnum';
import { convertNumeric } from './convertNumeric';

/**
 * @param destWindow
 * @param dispatch
 */
export const createGlobalConfigChangeHandler =
  ({
    destWindow,
    destWindows,
    dispatch,
  }: {
    destWindow?: string;
    destWindows?: string[] | undefined;
    dispatch: Dispatch<any>;
  }) =>
  (e: React.FormEvent<HTMLInputElement>, actionType: string) => {
    const target: string | number = convertNumeric(e.currentTarget.value);

    dispatch(makeDefaultActionCreator(actionType)(target));
    if (destWindows) {
      destWindows.forEach((destWindowStr) => {
        ipcRenderer.send(IPCRendererEnum.dispatchAction, {
          destWindow: destWindowStr,
          actionType,
          args: target,
        });
      });
    } else {
      ipcRenderer.send(IPCRendererEnum.dispatchAction, {
        destWindow,
        actionType,
        args: target,
      });
    }
  };
