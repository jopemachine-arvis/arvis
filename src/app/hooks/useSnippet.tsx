import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import {
  fetchSnippetCollection,
  loadSnippetCollection,
  loadSnippetCollectionInfo,
} from './utils/snippetLoader';

/**
 * @description
 */
const useSnippet = () => {
  const [snippets, setSnippets] = useState<Map<SnippetKeyword, SnippetItem>>(
    new Map()
  );

  const [snippetCollectionInfos, setSnippetCollectionInfos] = useState<
    Map<CollectionName, SnippetCollectionInfo>
  >(new Map());

  const reloadSnippets = (): void => {
    ipcRenderer.send(IPCRendererEnum.reloadSnippet, {
      destWindow: 'preferenceWindow',
    });
    ipcRenderer.send(IPCRendererEnum.reloadSnippet, {
      destWindow: 'assistanceWindow',
    });
  };

  const ipcCallbackTbl = {
    reloadSnippets: (e: IpcRendererEvent) => {
      fetchSnippetCollection()
        .then(({ snippetFiles, collectionInfos, collectionNames }) => {
          loadSnippetCollection(snippetFiles)
            .then((loadedSnippetData) => {
              const snippetsToSet = new Map<string, SnippetItem>();

              loadedSnippetData.forEach((snippet) => {
                snippetsToSet.set(snippet.keyword, snippet);
              });

              setSnippets(snippetsToSet);
              return null;
            })
            .catch(console.error);

          loadSnippetCollectionInfo(collectionInfos)
            .then((loadedCollectionInfos) => {
              const infos = new Map<string, SnippetCollectionInfo>();

              loadedCollectionInfos.forEach((collectionInfo) => {
                infos.set(collectionInfo.collection, collectionInfo.info);
              });

              // In case of not existing info.plist
              collectionNames.forEach((collectionName) => {
                if (!infos.has(collectionName)) {
                  infos.set(collectionName, {});
                }
              });

              setSnippetCollectionInfos(infos);
              return null;
            })
            .catch(console.error);

          return null;
        })
        .catch(console.error);
    },
  };

  useEffect(() => {
    reloadSnippets();
  }, []);

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.reloadSnippet, ipcCallbackTbl.reloadSnippets);

    return () => {
      ipcRenderer.off(IPCMainEnum.reloadSnippet, ipcCallbackTbl.reloadSnippets);
    };
  }, []);

  return {
    snippets,
    snippetCollectionInfos,
    reloadSnippets,
  };
};

export default useSnippet;
