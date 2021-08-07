/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */

import chalk from 'chalk';
import { dialog, globalShortcut, IpcMainEvent } from 'electron';
import toggleSearchWindow from '../../../windows/utils/toggleSearchWindow';
import toggleClipboardHistoryWindow from '../../../windows/utils/toggleClipboardHistoryWindow';

/**
 * @param shortcut
 * @param callback
 */
const registerShortcut = (shortcut: string, callback: () => void): boolean => {
  console.log(chalk.cyanBright(`Shortcut registered.. '${shortcut}'`));

  const loweredCaseShortcut = shortcut.toLowerCase();

  // Double modifier shortcut
  if (loweredCaseShortcut.includes('double')) {
    // Double modifier shortcut is handled with iohook
  }
  // Normal modifier shortcut
  else {
    try {
      if (globalShortcut.isRegistered(loweredCaseShortcut)) {
        return false;
      }
      globalShortcut.register(loweredCaseShortcut, callback as () => void);
    } catch (err) {
      dialog.showErrorBox(
        'Invalid Shortcut Assign',
        `'${loweredCaseShortcut}' is not invalid hotkeys. Please reassign this hotkey`
      );
    }
  }

  return true;
};

/**
 * Used to register electron global shortcuts in dev mode
 * @param callbackTable
 */
export const setGlobalShortcut = (
  e: IpcMainEvent,
  { callbackTable }: { callbackTable: any }
) => {
  const callbacks = JSON.parse(callbackTable);

  for (const hotkey of Object.keys(callbacks)) {
    if (hotkey.toLowerCase().includes('double')) continue;

    if (globalShortcut.isRegistered(hotkey)) {
      continue;
    }

    if (callbacks[hotkey] === 'toggleSearchWindow') {
      registerShortcut(hotkey, () => toggleSearchWindow({ showsUp: false }));
    }
    if (callbacks[hotkey] === 'toggleClipboardHistoryWindow') {
      registerShortcut(hotkey, () =>
        toggleClipboardHistoryWindow({ showsUp: false })
      );
    }
  }
};
