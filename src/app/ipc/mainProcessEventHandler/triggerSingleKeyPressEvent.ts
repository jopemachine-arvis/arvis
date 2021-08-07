/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { IpcMainEvent } from 'electron';
import { singleKeyPressHandlers } from '../iohookShortcutCallbacks';

/**
 * @param key
 */
export const triggerSingleKeyPressEvent = (
  e: IpcMainEvent,
  { key }: { key: string }
) => {
  if (singleKeyPressHandlers) {
    singleKeyPressHandlers.get(key)!();
  }
};
