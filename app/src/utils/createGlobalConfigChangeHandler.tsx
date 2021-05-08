import { ipcRenderer } from 'electron';
import { Dispatch } from 'react';
import makeActionCreator from './makeActionCreator';
import { isNumeric } from './isNumeric';

export const createGlobalConfigChangeHandler = ({
  destWindow,
  dispatch
}: {
  destWindow: string;
  dispatch: Dispatch<any>;
}) => (e: React.FormEvent<HTMLInputElement>, actionType: string) => {
  const target: string | number = isNumeric(e.currentTarget.value)
    ? Number(e.currentTarget.value)
    : e.currentTarget.value;

  dispatch(makeActionCreator(actionType, 'arg')(target));
  ipcRenderer.send('dispatch-action', {
    destWindow,
    actionType,
    args: target
  });
};
