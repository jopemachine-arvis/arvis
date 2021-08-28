/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef } from 'react';
import path from 'path';
import { getArvisAssetsPath } from '@config/path';
import { useSelector } from 'react-redux';
import { StateType } from '@redux/reducers/types';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import useForceUpdate from 'use-force-update';
import { IPCMainEnum } from '@ipc/ipcEventEnum';

const transformStore = (store: any[]): any[] => {
  const iconPath = path.resolve(
    getArvisAssetsPath(),
    'images',
    'clipboardHistoryItem.svg'
  );

  const items = store.map((item) => {
    return {
      title: item.text,
      bundleId: 'arvis.clipboardHistory',
      icon: {
        path: iconPath,
      },
      date: item.date,
    };
  });

  return items.reverse();
};

/**
 */
const useClipboardHistory = ({
  items,
  setItems,
  originalItems,
  setOriginalItems,
  mode,
  renewHandler,
  maxShowOnScreen,
  maxShowOnWindow,
}: {
  items: any[];
  setItems: (items: any[]) => void;
  originalItems: any[];
  setOriginalItems: (items: any[]) => void;
  mode: string | undefined;
  renewHandler: React.MutableRefObject<() => void>;
  maxShowOnScreen: number;
  maxShowOnWindow: number;
}) => {
  const { store } = useSelector((state: StateType) => state.clipboard_history);

  const maxShowOnWindowRef = useRef<number>(maxShowOnWindow);

  const forceUpdate = useForceUpdate();

  const storeRef = useRef<any>(store);

  storeRef.current = store;

  const ipcCallbackTbl = {
    renewClipboardStore: (e: IpcRendererEvent) => {
      forceUpdate();
      // wait until force update is done.
      setTimeout(() => {
        const newItems = transformStore(storeRef.current);
        setItems(newItems.slice(0, maxShowOnWindowRef.current));
        setOriginalItems(transformStore(storeRef.current));
        renewHandler.current();
      }, 15);
    },
  };

  useEffect(() => {
    if (mode === 'clipboardHistory') {
      setItems(transformStore(store).slice(0, maxShowOnWindow));
      setOriginalItems(transformStore(store));
    }
  }, [mode, maxShowOnScreen, maxShowOnWindow]);

  useEffect(() => {
    ipcRenderer.on(
      IPCMainEnum.renewClipboardStore,
      ipcCallbackTbl.renewClipboardStore
    );

    return () => {
      ipcRenderer.off(
        IPCMainEnum.renewClipboardStore,
        ipcCallbackTbl.renewClipboardStore
      );
    };
  }, []);
};

export default useClipboardHistory;
