/* eslint-disable no-restricted-syntax */
import { getArvisAssetsPath } from '@config/path';
import { IPCMainEnum } from '@ipc/ipcEventEnum';
import { ipcRenderer } from 'electron';
import { IpcRendererEvent } from 'electron/main';
import path from 'path';
import React, { useEffect, useRef } from 'react';
import { SubInfoText, InfoInnerContainer } from '../components';

const transform = (store: SnippetItem[]): any[] => {
  const iconPath = path.resolve(
    getArvisAssetsPath(),
    'images',
    'clipboardHistoryItem.svg'
  );

  const items = store.map((item) => {
    return {
      title: item.name,
      bundleId: 'arvis.snippet',
      snippet: item.snippet,
      collection: item.collection,
      keyword: item.keyword,
      icon: {
        path: iconPath,
      },
    };
  });

  return items;
};

/**
 */
const useSnippetMode = ({
  items,
  setItems,
  originalItems,
  setOriginalItems,
  indexInfo,
  mode,
  snippets,
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
  snippets: SnippetItem[];
  renewHandler: React.MutableRefObject<() => void>;
  maxShowOnScreen: number;
  maxShowOnWindow: number;
  onWindowOpenEventHandlers: Map<string, () => void>;
}) => {
  const maxShowOnWindowRef = useRef<number>(maxShowOnWindow);

  const snippetsRef = useRef<SnippetItem[]>(snippets);

  snippetsRef.current = snippets;

  const ipcCallbackTbl = {
    reloadSnippet: (e: IpcRendererEvent) => {},
  };

  const reload = () => {
    setItems(
      transform(snippetsRef.current).slice(0, maxShowOnWindowRef.current)
    );
    setOriginalItems(transform(snippetsRef.current));
  };

  useEffect(() => {
    onWindowOpenEventHandlers.set('snippet', reload);
  }, []);

  useEffect(() => {
    if (mode === 'snippet') {
      reload();
    }
  }, [mode, maxShowOnScreen, maxShowOnWindow]);

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.reloadSnippet, ipcCallbackTbl.reloadSnippet);
    return () => {
      ipcRenderer.off(IPCMainEnum.reloadSnippet, ipcCallbackTbl.reloadSnippet);
    };
  }, []);

  const renderInfoContent = () => {
    if (!items[indexInfo.selectedItemIdx]) return <></>;
    const { snippet } = items[indexInfo.selectedItemIdx];
    if (!snippet) return <></>;

    return (
      <>
        <InfoInnerContainer>{snippet}</InfoInnerContainer>
        <SubInfoText
          style={{
            height: '9%',
          }}
        >
          {`${snippet.split(' ').length} Words, ${snippet.length} Characters`}
          <br />
          {`Keyword: ${items[indexInfo.selectedItemIdx].keyword ?? ''}`}
        </SubInfoText>
      </>
    );
  };

  return { renderInfoContent };
};

export default useSnippetMode;
