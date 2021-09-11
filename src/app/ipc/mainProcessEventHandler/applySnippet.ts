/* eslint-disable no-plusplus */

import { IpcMainEvent, clipboard } from 'electron';
import robot from 'robotjs';

/**
 */
export const applySnippet = (
  e: IpcMainEvent,
  { keyword, snippet }: { keyword: string; snippet: string }
) => {
  for (let i = 0; i < keyword.length; ++i) {
    robot.keyTap('backspace');
  }

  clipboard.writeText(snippet);

  robot.keyTap('v', [process.platform === 'darwin' ? 'command' : 'control']);
};
