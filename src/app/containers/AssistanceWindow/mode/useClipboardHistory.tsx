/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef } from 'react';
import path from 'path';
import { getArvisAssetsPath } from '@config/path';
import { useSelector } from 'react-redux';
import { StateType } from '@redux/reducers/types';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import useForceUpdate from 'use-force-update';
import { IPCMainEnum } from '@ipc/ipcEventEnum';
import { SubInfoText, InfoInnerContainer } from '../components';

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
  indexInfo,
  mode,
  renewHandler,
  maxShowOnScreen,
  maxShowOnWindow,
  onWindowOpenEventHandlers,
}: {
  items: any[];
  setItems: (items: any[]) => void;
  originalItems: any[];
  setOriginalItems: (items: any[]) => void;
  indexInfo: any;
  mode: AssistanceWindowType | undefined;
  renewHandler: React.MutableRefObject<() => void>;
  maxShowOnScreen: number;
  maxShowOnWindow: number;
  onWindowOpenEventHandlers: Map<string, () => void>;
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

  const reload = () => {
    setItems(
      transformStore(storeRef.current).slice(0, maxShowOnWindowRef.current)
    );
    setOriginalItems(transformStore(storeRef.current));
  };

  useEffect(() => {
    onWindowOpenEventHandlers.set('clipboardHistory', reload);
  }, []);

  useEffect(() => {
    if (mode === 'clipboardHistory') {
      reload();
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

  const renderInfoContent = () => (
    <>
      <InfoInnerContainer>
        {items[indexInfo.selectedItemIdx]
          ? items[indexInfo.selectedItemIdx].title
          : ''}
      </InfoInnerContainer>
      <SubInfoText>
        {items[indexInfo.selectedItemIdx] &&
          `Copied on ${new Date(
            items[indexInfo.selectedItemIdx].date
          ).toLocaleString()}`}
      </SubInfoText>
    </>
  );

  return { renderInfoContent };
};

export default useClipboardHistory;
