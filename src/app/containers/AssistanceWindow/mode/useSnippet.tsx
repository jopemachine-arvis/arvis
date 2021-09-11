import path from 'path';
import { arvisSnippetCollectionPath, getArvisAssetsPath } from '@config/path';
import React, { useCallback, useEffect, useRef } from 'react';
import { SubInfoText, InfoInnerContainer } from '../components';

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
  snippetCollectionInfos,
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
  snippetCollectionInfos: Map<CollectionName, SnippetCollectionInfo>;
  renewHandler: React.MutableRefObject<() => void>;
  maxShowOnScreen: number;
  maxShowOnWindow: number;
  onWindowOpenEventHandlers: Map<string, () => void>;
}) => {
  const maxShowOnWindowRef = useRef<number>(maxShowOnWindow);

  const snippetsRef = useRef<SnippetItem[]>(snippets);

  snippetsRef.current = snippets;

  const transform = useCallback(
    (store: SnippetItem[]): any[] => {
      const defaultIconPath = path.resolve(
        getArvisAssetsPath(),
        'images',
        'clipboardIcon.svg'
      );

      return store.map((snippet) => {
        const iconPath = snippetCollectionInfos.get(snippet.collection)!.hasIcon
          ? path.resolve(
              arvisSnippetCollectionPath,
              snippet.collection,
              'icon.png'
            )
          : defaultIconPath;

        return {
          title: snippet.name,
          bundleId: 'arvis.snippet',
          snippet: snippet.snippet,
          collection: snippet.collection,
          keyword: snippet.keyword,
          icon: {
            path: iconPath,
          },
        };
      });
    },
    [snippetCollectionInfos]
  );

  const reset = () => {
    setItems(
      transform(snippetsRef.current).slice(0, maxShowOnWindowRef.current)
    );
    setOriginalItems(transform(snippetsRef.current));
  };

  useEffect(() => {
    onWindowOpenEventHandlers.set('snippet', reset);
  }, []);

  useEffect(() => {
    if (mode === 'snippet') {
      reset();
    }
  }, [mode, maxShowOnScreen, maxShowOnWindow]);

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
