import React, { useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import path from 'path';
import pathExists from 'path-exists';
import { arvisSnippetCollectionPath } from '@config/path';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import {
  fetchSnippetCollection,
  loadSnippetCollection,
  loadSnippetCollectionInfo,
} from './utils/snippetLoader';

/**
 * @description
 */
const useSnippet = () => {
  const [snippets, setSnippets] = useState<SnippetItem[]>([]);

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
              const snippetsToSet: SnippetItem[] = [];

              loadedSnippetData.forEach((snippet) => {
                snippetsToSet.push(snippet);
              });

              setSnippets(snippetsToSet);
              return null;
            })
            .catch(console.error);

          loadSnippetCollectionInfo(collectionInfos)
            .then((loadedCollectionInfos) => {
              const infos = new Map<CollectionName, SnippetCollectionInfo>();

              loadedCollectionInfos.forEach((collectionInfo) => {
                infos.set(collectionInfo.collection, collectionInfo.info);
              });

              collectionNames.forEach(async (collectionName) => {
                const hasIcon = await pathExists(
                  path.resolve(
                    arvisSnippetCollectionPath,
                    collectionName,
                    'icon.png'
                  )
                );

                // In case of not existing info.plist
                if (!infos.has(collectionName)) {
                  infos.set(collectionName, { hasIcon });
                }

                infos.set(collectionName, {
                  ...infos.get(collectionName)!,
                  hasIcon,
                });
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
