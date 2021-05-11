import { ipcRenderer } from 'electron';
import { Dispatch } from 'react';
import makeActionCreator from './makeActionCreator';
import { isNumeric } from './isNumeric';
import { IPCRendererEnum } from '../ipc/ipcEventEnum';

/**
 * @param  {string} destWindow
 * @param  {Dispatch<any>} dispatch
 * @summary
 */
export const createGlobalConfigChangeHandler = ({
  destWindow,
  dispatch,
}: {
  destWindow: string;
  dispatch: Dispatch<any>;
}) => (e: React.FormEvent<HTMLInputElement>, actionType: string) => {
  const target: string | number = isNumeric(e.currentTarget.value)
    ? Number(e.currentTarget.value)
    : e.currentTarget.value;

  dispatch(makeActionCreator(actionType, 'arg')(target));
  ipcRenderer.send(IPCRendererEnum.dispatchAction, {
    destWindow,
    actionType,
    args: target,
  });
};
