import React, { useEffect, useMemo, useRef } from 'react';
import { keyCodeToString } from '@utils/iohook/keyUtils';
import { ipcRenderer } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { modifierKeys } from '@utils/iohook/keyTbl';
import { shiftCharTable } from '@utils/shiftCharTable';
import _ from 'lodash';
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
    return (shiftCharTable as any)[str] ?? str;
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
  snippets: SnippetItem[];
  collectionInfo: Map<CollectionName, SnippetCollectionInfo>;
}) => {
  const snippetsByKeyword = useMemo(
    () => _.groupBy(snippets, 'keyword'),
    [snippets]
  );

  const snippetsByKeywordRef =
    useRef<_.Dictionary<SnippetItem[]>>(snippetsByKeyword);

  snippetsByKeywordRef.current = snippetsByKeyword;

  const ioHook = useIoHook();

  const validateKeywords = () => {
    let valid = true;
    let payload = '';

    Object.keys(snippetsByKeyword).forEach((keyword) => {
      if (keyword !== '') {
        const matchingSnippets = snippetsByKeyword[keyword].filter(
          (snippet) => snippet.useAutoExpand
        );

        if (matchingSnippets.length > 1) {
          valid = false;
          payload = keyword;

          console.log(
            `Duplicated snippet keyword!`,
            snippetsByKeyword[keyword]
          );
        }
      }
    });

    return {
      valid,
      payload,
    };
  };

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

    [...snippetItemBuffers.keys()].forEach((snippetBuffer) => {
      let charBuffer = snippetItemBuffers.get(snippetBuffer)!;

      const keywordWithPrefixAndSuffix = `${snippetBuffer.prefix}${snippetBuffer.keyword}${snippetBuffer.suffix}`;

      if (keywordWithPrefixAndSuffix[charBuffer.length] === pressedKey) {
        charBuffer += pressedKey;
        snippetItemBuffers.set(snippetBuffer, charBuffer);

        if (
          keywordWithPrefixAndSuffix === charBuffer &&
          keywordWithPrefixAndSuffix.length >
            longestMatchKeywordInfo.keyword.length
        ) {
          longestMatchKeywordInfo = snippetBuffer;
        }
      } else {
        snippetItemBuffers.set(snippetBuffer, '');
      }
    });

    if (longestMatchKeywordInfo.keyword.length !== 0) {
      const { prefix, keyword, suffix } = longestMatchKeywordInfo;
      const keywordWithPrefixAndSuffix = `${prefix}${keyword}${suffix}`;

      applySnippet(
        keywordWithPrefixAndSuffix,
        snippetsByKeywordRef.current[keyword]![0].snippet
      );
    }
  };

  const mouseClickHandler = () => {
    clearSnippetItemBuffers();
  };

  useEffect(() => {
    if (snippets && collectionInfo) {
      snippetItemBuffers.clear();

      Object.keys(snippetsByKeyword).forEach((keyword) => {
        const snippet = snippetsByKeyword[keyword]![0];

        if (snippet.useAutoExpand && snippet.keyword) {
          const info: SnippetCollectionInfo =
            collectionInfo.get(snippet.collection) ?? {};
          const prefix = info.snippetKeywordPrefix ?? '';
          const suffix = info.snippetKeywordSuffix ?? '';

          snippetItemBuffers.set({ keyword, prefix, suffix }, '');
        }
      });
    }
  }, [snippetsByKeyword, collectionInfo]);

  useEffect(() => {
    const { valid, payload } = validateKeywords();

    if (!valid) {
      ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
        title: 'Duplicated snippet keyword',
        content: `There is a duplicated keyword: '${payload}'. Please reassign these keyword.`,
      });
    }
  }, [snippets]);

  useEffect(() => {
    ioHook.on('keydown', keyDownEventHandler);
    ioHook.on('mouseclick', mouseClickHandler);
  }, []);
};

export default useSnippetKeywords;
