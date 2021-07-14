/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { globalShortcut, dialog } from 'electron';
import chalk from 'chalk';
import defaultShortcutCallbackTbl from './defaultShortcutCallbackTable';
import { IPCMainEnum } from './ipcEventEnum';
import { WindowManager } from '../windows';
import toggleSearchWindow from './toggleSearchWindow';
import { doubleKeyPressHandler } from './iohookShortcutCallbacks';

/**
 * @param  {any} hotKeyAction
 */
const getWorkflowHotkeyPressHandler = ({
  hotKeyAction,
}: {
  hotKeyAction: any;
}) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();
  const actionTypes: string[] = hotKeyAction.actions.map(
    (item: any) => item.type
  );

  if (actionTypes.includes('keyword') || actionTypes.includes('scriptFilter')) {
    toggleSearchWindow({ showsUp: true });
  }

  // Force action to be executed after window shows up
  setTimeout(() => {
    searchWindow.webContents.send(IPCMainEnum.executeAction, {
      action: hotKeyAction.actions.map((item: any) => {
        item.bundleId = hotKeyAction.bundleId;
        return item;
      }),
      bundleId: hotKeyAction.bundleId,
    });
  }, 100);
};

/**
 * @param  {string} shortcut
 */
const extractShortcutName = (shortcut: string): string => {
  const target = shortcut.replaceAll('+', ' ').toLowerCase().trim();

  switch (target) {
    case 'option':
    case 'opt':
    case 'alt':
      return 'alt';

    case 'shift':
      return 'shift';

    case 'windows':
    case 'window':
    case 'win':
    case 'cmd':
    case 'command':
    case 'meta':
      return 'cmd';

    case 'control':
    case 'ctl':
    case 'ctrl':
      return 'ctrl';

    default:
      console.error(`${shortcut} is not valid shortcut`);
  }

  throw new Error('Not valid operation occurs in convertShortcutName');
};

/**
 * @param  {string} shortcut
 * @param  {() => void} callback
 */
const registerShortcut = (shortcut: string, callback: () => void): boolean => {
  console.log(chalk.cyanBright(`Shortcut registered.. '${shortcut}'`));

  const loweredCaseShortcut = shortcut.toLowerCase();

  // Double modifier shortcut
  if (loweredCaseShortcut.includes('double')) {
    const doubledKeyModifier = extractShortcutName(
      loweredCaseShortcut.split('double')[1]
    );

    // Already used shortcut
    if ((doubleKeyPressHandler as any)[doubledKeyModifier]) {
      return false;
    }

    doubleKeyPressHandler[
      doubledKeyModifier as 'shift' | 'alt' | 'cmd' | 'ctrl'
    ] = callback;
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
 * @param  {any} workflowHotkeyTbl
 */
const registerWorkflowHotkeys = ({
  workflowHotkeyTbl,
}: {
  workflowHotkeyTbl: any;
}) => {
  const hotkeys = Object.keys(workflowHotkeyTbl);
  for (const hotkey of hotkeys) {
    // Skip hotkey assigning if empty
    if (hotkey.trim() === '') {
      continue;
    }

    const cb = () => {
      getWorkflowHotkeyPressHandler({
        hotKeyAction: workflowHotkeyTbl[hotkey],
      });
    };

    if (!registerShortcut(hotkey, cb)) {
      dialog.showErrorBox(
        'Duplicated Shortcuts Found',
        `'${hotkey}' has been assigned as duplicate. Please reassign hotkeys`
      );
    }
  }
};

/**
 * @param  {any} callbackTable
 * @param  {any} workflowHotkeyTbl
 */
export default ({
  callbackTable,
  workflowHotkeyTbl,
}: {
  callbackTable: any;
  workflowHotkeyTbl: any;
}) => {
  const shortcuts = Object.keys(callbackTable);

  registerWorkflowHotkeys({ workflowHotkeyTbl });

  for (const shortcut of shortcuts) {
    const action = callbackTable[shortcut];

    if (
      !registerShortcut(shortcut, (defaultShortcutCallbackTbl as any)[action]())
    ) {
      dialog.showErrorBox(
        'Duplicated Shortcuts Found',
        `'${shortcut}' has been assigned as duplicate. Please reassign hotkeys`
      );
    }
  }
};
