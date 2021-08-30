/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-plusplus */

import { IpcMainEvent, clipboard } from 'electron';
import robot from 'robotjs';
import parseJson from 'parse-json';

/**
 */
export const applySnippet = (
  e: IpcMainEvent,
  { snippetItemStr }: { snippetItemStr: string }
) => {
  const snippetItem: SnippetItem = parseJson(snippetItemStr);

  for (let i = 0; i < snippetItem.keyword.length; ++i) {
    robot.keyTap('backspace');
  }

  clipboard.writeText(snippetItem.snippet);

  robot.keyTap('v', [process.platform === 'darwin' ? 'command' : 'control']);
};
