import React, { useEffect, useRef, useState } from 'react';
import {
  fetchSnippetCollection,
  loadSnippetCollection,
} from './utils/snippetLoader';
/**
 * @description
 */
const useSnippet = () => {
  const [snippets, setSnippets] = useState<Map<SnippetKeyword, SnippetItem>>(
    new Map()
  );

  const snippetsRef = useRef<Map<SnippetKeyword, SnippetItem>>(snippets);

  snippetsRef.current = snippets;

  const reloadSnippets = (): void => {
    fetchSnippetCollection()
      .then(loadSnippetCollection)
      .then((loadedSnippetData) => {
        const snippetsToSet = new Map<string, SnippetItem>();

        loadedSnippetData.forEach((snippet) => {
          snippetsToSet.set(snippet.keyword, snippet);
        });

        setSnippets(snippetsToSet);
        return null;
      })
      .catch(console.error);
  };

  useEffect(() => {
    reloadSnippets();
  }, []);

  return {
    snippets,
    reloadSnippets,
  };
};

export default useSnippet;
