import { ipcRenderer } from 'electron';
import { Dispatch } from 'redux';
import { makeDefaultActionCreator } from './makeActionCreator';
import { IPCRendererEnum } from '../ipc/ipcEventEnum';
import { convertNumeric } from './convertNumeric';

/**
 *
 */
export const globalConfigChangeHandler = (
  e: React.FormEvent<HTMLInputElement>,
  actionType: string,
  options?: { destWindows?: string[]; self?: boolean; dispatch?: Dispatch<any> }
) => {
  const target: string | number = convertNumeric(e.currentTarget.value);

  if (options?.self) {
    options?.dispatch!(makeDefaultActionCreator(actionType)(target));
  }

  if (options?.destWindows) {
    options.destWindows.forEach((destWindow) => {
      ipcRenderer.send(IPCRendererEnum.dispatchAction, {
        actionType,
        destWindow,
        args: target,
      });
    });
  } else {
    ipcRenderer.send(IPCRendererEnum.dispatchAction, {
      actionType,
      args: target,
    });
  }
};
