/* eslint-disable no-restricted-syntax */
import { ipcRenderer } from 'electron';
import { Dispatch } from 'react';
import makeActionCreator from './makeActionCreator';
import { isNumeric } from './isNumeric';
import { IPCRendererEnum } from '../ipc/ipcEventEnum';

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
    const target: string | number = isNumeric(e.currentTarget.value)
      ? Number(e.currentTarget.value)
      : e.currentTarget.value;

    dispatch(makeActionCreator(actionType, 'arg')(target));
    if (destWindows) {
      for (const destWindowStr of destWindows) {
        ipcRenderer.send(IPCRendererEnum.dispatchAction, {
          destWindow: destWindowStr,
          actionType,
          args: target,
        });
      }
    } else {
      ipcRenderer.send(IPCRendererEnum.dispatchAction, {
        destWindow,
        actionType,
        args: target,
      });
    }
  };
