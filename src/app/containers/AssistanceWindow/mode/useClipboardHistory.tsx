import React, { useEffect, useRef } from 'react';
import path from 'path';
import { getArvisAssetsPath } from '@config/path';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import useForceUpdate from 'use-force-update';
import { IPCMainEnum } from '@ipc/ipcEventEnum';
import { SubInfoText, InfoInnerContainer } from '../components';
import { trimDisplayText } from './utils';

const transform = (store: any[]): any[] => {
  const iconPath = path.resolve(
    getArvisAssetsPath(),
    'images',
    'clipboardIcon.svg'
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
const useClipboardHistoryMode = ({
  store,
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
  store: any[];
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
  const maxShowOnWindowRef = useRef<number>(maxShowOnWindow);

  const forceUpdate = useForceUpdate();

  const storeRef = useRef<any>(store);

  storeRef.current = store;

  const ipcCallbackTbl = {
    renewClipboardStore: (e: IpcRendererEvent) => {
      forceUpdate();
      // wait until force update is done.
      setTimeout(() => {
        const newItems = transform(storeRef.current);
        setItems(newItems.slice(0, maxShowOnWindowRef.current));
        setOriginalItems(transform(storeRef.current));
        renewHandler.current();
      }, 15);
    },
  };

  const reload = () => {
    setItems(transform(storeRef.current).slice(0, maxShowOnWindowRef.current));
    setOriginalItems(transform(storeRef.current));
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

  const clipboardItemText = items[indexInfo.selectedItemIdx]?.title ?? '';

  const renderInfoContent = () => (
    <>
      <InfoInnerContainer>
        {clipboardItemText ? trimDisplayText(clipboardItemText) : ''}
      </InfoInnerContainer>
      <SubInfoText style={{ height: '1.5%' }}>
        {clipboardItemText &&
          `Copied on ${new Date(
            items[indexInfo.selectedItemIdx]!.date
          ).toLocaleString()}`}
      </SubInfoText>
      <SubInfoText>
        {clipboardItemText &&
          `${clipboardItemText.split(' ').length} Words, ${
            clipboardItemText.length
          } Characters`}
      </SubInfoText>
    </>
  );

  return { renderInfoContent };
};

export default useClipboardHistoryMode;
