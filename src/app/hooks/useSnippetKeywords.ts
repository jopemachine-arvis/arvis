import React, { useEffect, useRef } from 'react';
import { keyCodeToString } from '@utils/iohook/keyUtils';
import { ipcRenderer } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { modifierKeys, specialCharTable } from '@utils/iohook/keyTbl';
import { useIoHook } from '.';

const snippetItemBuffers = new Map<
  {
    keyword: SnippetKeyword;
    prefix: string;
    suffix: string;
  },
  CharBuffer
>();

// To do:: Add here other special character handling logic
const keyCodeToStringAdapter = (e: IOHookKeyEvent) => {
  const str = keyCodeToString(e.keycode);
  if (str === 'Space') return ' ';
  if (e.shiftKey) {
    return (specialCharTable as any)[str] ?? str;
  }

  return str;
};

/**
 * @description
 */
const useSnippetKeywords = ({
  snippets,
  collectionInfo,
}: {
  snippets: Map<SnippetKeyword, SnippetItem>;
  collectionInfo: Map<CollectionName, SnippetCollectionInfo>;
}) => {
  const snippetsRef = useRef<Map<SnippetKeyword, SnippetItem>>(snippets);

  snippetsRef.current = snippets;

  const ioHook = useIoHook();

  const clearSnippetItemBuffers = (): void => {
    [...snippetItemBuffers.keys()].forEach((snippetKeyword) => {
      snippetItemBuffers.set(snippetKeyword, '');
    });
  };

  const applySnippet = (keyword: string, snippet: string): void => {
    clearSnippetItemBuffers();

    ipcRenderer.send(IPCRendererEnum.applySnippet, {
      keyword,
      snippet,
    });
  };

  const keyDownEventHandler = (e: IOHookKeyEvent): void => {
    // Ignore single modifier key press event
    if (modifierKeys.includes(e.keycode)) return;

    let longestMatchKeywordInfo = {
      keyword: '',
      prefix: '',
      suffix: '',
    };

    const pressedKey = keyCodeToStringAdapter(e);

    [...snippetItemBuffers.keys()].forEach((snippetKeyword) => {
      let charBuffer = snippetItemBuffers.get(snippetKeyword)!;

      const keywordWithPrefixAndSuffix = `${snippetKeyword.prefix}${snippetKeyword.keyword}${snippetKeyword.suffix}`;

      if (keywordWithPrefixAndSuffix[charBuffer.length] === pressedKey) {
        charBuffer += pressedKey;
        snippetItemBuffers.set(snippetKeyword, charBuffer);

        if (
          keywordWithPrefixAndSuffix === charBuffer &&
          keywordWithPrefixAndSuffix.length >
            longestMatchKeywordInfo.keyword.length
        ) {
          longestMatchKeywordInfo = snippetKeyword;
        }
      } else {
        snippetItemBuffers.set(snippetKeyword, '');
      }
    });

    if (longestMatchKeywordInfo.keyword.length !== 0) {
      const { prefix, keyword, suffix } = longestMatchKeywordInfo;
      const keywordWithPrefixAndSuffix = `${prefix}${keyword}${suffix}`;
      applySnippet(
        keywordWithPrefixAndSuffix,
        snippetsRef.current.get(keyword)!.snippet
      );
    }
  };

  const mouseClickHandler = () => {
    clearSnippetItemBuffers();
  };

  useEffect(() => {
    if (snippets && collectionInfo) {
      snippetItemBuffers.clear();

      [...snippets.keys()].forEach((snippetKeyword) => {
        const info: SnippetCollectionInfo =
          collectionInfo.get(snippets.get(snippetKeyword)!.collection) ?? {};
        const prefix = info.snippetKeywordPrefix ?? '';
        const suffix = info.snippetKeywordSuffix ?? '';

        snippetItemBuffers.set({ keyword: snippetKeyword, prefix, suffix }, '');
      });
    }
  }, [snippets, collectionInfo]);

  useEffect(() => {
    ioHook.on('keydown', keyDownEventHandler);
    ioHook.on('mouseclick', mouseClickHandler);
  }, []);
};

export default useSnippetKeywords;
