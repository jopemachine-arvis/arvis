/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */

import chalk from 'chalk';
import { dialog, globalShortcut, IpcMainEvent } from 'electron';
import defaultShortcutCallbackTbl from '../../../config/shortcuts/defaultShortcutCallbackTable';

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
        `'${loweredCaseShortcut}' is not valid hotkeys. Please reassign this hotkey`
      );
    }
  }

  return true;
};

/**
 * Used to register electron global shortcuts
 * @param defaultCallbackTable
 */
export const setGlobalShortcut = (
  e: IpcMainEvent,
  { defaultCallbackTable }: { defaultCallbackTable: any }
) => {
  const callbackTable = JSON.parse(defaultCallbackTable);

  for (const shortcut in callbackTable) {
    if (shortcut.toLowerCase().includes('double')) continue;
    const callbackName = callbackTable[shortcut];

    if (
      !registerShortcut(
        shortcut,
        (defaultShortcutCallbackTbl as any)[callbackName]()
      )
    ) {
      dialog.showErrorBox(
        'Duplicated Shortcuts Found',
        `'${shortcut}' has been assigned as duplicate. Please reassign hotkeys`
      );
    }
  }
};
