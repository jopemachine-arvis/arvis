import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IPCMainEnum } from '@ipc/ipcEventEnum';
import { makeDefaultActionCreator } from '@utils/makeActionCreator';

const useReduxFetcher = () => {
  const dispatch = useDispatch();

  const fetchAction = (
    e: IpcRendererEvent,
    { actionType, args }: { actionType: string; args: any }
  ) => {
    dispatch(makeDefaultActionCreator(actionType)(args));
  };

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.fetchAction, fetchAction);

    return () => {
      ipcRenderer.off(IPCMainEnum.fetchAction, fetchAction);
    };
  }, []);
};

export default useReduxFetcher;
