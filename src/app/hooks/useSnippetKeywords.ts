import React, { useEffect, useRef } from 'react';
import { keyCodeToString } from '@utils/iohook/keyUtils';
import { ipcRenderer } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { useIoHook } from '.';

const snippetItemBuffers = new Map<SnippetKeyword, CharBuffer>();

const keyCodeToStringAdapter = (keycode: number) => {
  const str = keyCodeToString(keycode);
  if (str === 'Space') return ' ';
  return str;
};

/**
 * @description
 */
const useSnippetKeywords = (snippets: Map<SnippetKeyword, SnippetItem>) => {
  const snippetsRef = useRef<Map<SnippetKeyword, SnippetItem>>(snippets);

  snippetsRef.current = snippets;

  const ioHook = useIoHook();

  const clearSnippetItemBuffers = (): void => {
    [...snippetItemBuffers.keys()].forEach((snippetKeyword) => {
      snippetItemBuffers.set(snippetKeyword, '');
    });
  };

  const applySnippet = (snippetItem: SnippetItem): void => {
    clearSnippetItemBuffers();

    ipcRenderer.send(IPCRendererEnum.applySnippet, {
      snippetItemStr: JSON.stringify(snippetItem),
    });
  };

  const keyDownEventHandler = (e: IOHookKeyEvent): void => {
    let longestMatchCompleted = '';

    [...snippetItemBuffers.keys()].forEach((snippetKeyword) => {
      let charBuffer = snippetItemBuffers.get(snippetKeyword)!;
      const pressedKey = keyCodeToStringAdapter(e.keycode);

      // To do:: Add here other special character handling logic
      if (snippetKeyword[charBuffer.length] === pressedKey) {
        charBuffer += pressedKey;
        snippetItemBuffers.set(snippetKeyword, charBuffer);

        if (
          snippetKeyword === charBuffer &&
          snippetKeyword.length > longestMatchCompleted.length
        ) {
          longestMatchCompleted = snippetKeyword;
        }
      } else {
        snippetItemBuffers.set(snippetKeyword, '');
      }
    });

    if (longestMatchCompleted.length !== 0) {
      applySnippet(snippetsRef.current.get(longestMatchCompleted)!);
    }
  };

  const mouseClickHandler = () => {
    clearSnippetItemBuffers();
  };

  useEffect(() => {
    [...snippets.keys()].forEach((snippetKeyword) => {
      snippetItemBuffers.set(snippetKeyword, '');
    });
  }, [snippets]);

  useEffect(() => {
    ioHook.on('keydown', keyDownEventHandler);
    ioHook.on('mouseclick', mouseClickHandler);
  }, []);
};

export default useSnippetKeywords;
