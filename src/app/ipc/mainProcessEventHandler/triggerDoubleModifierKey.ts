/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { IpcMainEvent } from 'electron';
import { doubleKeyPressHandler } from '../iohookShortcutCallbacks';

/**
 * @param modifier
 */
export const triggerDoubleModifierKey = (
  e: IpcMainEvent,
  { modifier }: { modifier: string }
) => {
  if (doubleKeyPressHandler[modifier as 'shift' | 'alt' | 'cmd' | 'ctrl']) {
    doubleKeyPressHandler[modifier as 'shift' | 'alt' | 'cmd' | 'ctrl']!();
  }
};
