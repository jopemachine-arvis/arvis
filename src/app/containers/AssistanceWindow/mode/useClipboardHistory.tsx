/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef, useState } from 'react';
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
  mode,
  renewHandler,
  maxShowOnScreen,
  maxShowOnWindow,
}: {
  mode: string;
  renewHandler: () => void;
  maxShowOnScreen: number;
  maxShowOnWindow: number;
}) => {
  const { store } = useSelector((state: StateType) => state.clipboard_history);

  const [items, setItems] = useState<any[]>(
    transformStore(store).slice(0, maxShowOnWindow)
  );

  const [originalItems, setOriginalItems] = useState<any[]>(
    transformStore(store)
  );

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
        renewHandler();
      }, 15);
    },
  };

  useEffect(() => {
    setItems(transformStore(store).slice(0, maxShowOnWindow));
    setOriginalItems(transformStore(store));
  }, [maxShowOnScreen, maxShowOnWindow]);

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

  if (mode !== 'clipboardHistory') {
    return {};
  }

  return {
    items,
    setItems,
    originalItems,
    setOriginalItems,
  };
};

export default useClipboardHistory;
