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

  const [snippetCollectionInfos, setSnippetCollectionInfos] =
    useState<Map<CollectionName, SnippetCollectionInfo>>();

  const reloadSnippets = (): void => {
    fetchSnippetCollection()
      .then(({ collections, collectionInfos }) => {
        loadSnippetCollection(collections)
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
            const infos = new Map<string, any>();

            loadedCollectionInfos.forEach((collectionInfo) => {
              infos.set(collectionInfo.collection, collectionInfo.info);
            });

            setSnippetCollectionInfos(infos);
            return null;
          })
          .catch(console.error);

        return null;
      })
      .catch(console.error);
  };

  useEffect(() => {
    reloadSnippets();
  }, []);

  return {
    snippets,
    snippetCollectionInfos,
    reloadSnippets,
  };
};

export default useSnippet;
