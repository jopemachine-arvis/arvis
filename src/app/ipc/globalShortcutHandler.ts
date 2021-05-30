/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import { globalShortcut, dialog } from 'electron';
import defaultShortcutCallbackTbl from './defaultShortcutCallbackTable';
import { IPCMainEnum } from './ipcEventEnum';
import { WindowManager } from '../windows';
import toggleSearchWindow from './toggleSearchWindow';
import { doubleKeyPressHandler } from './iohookShortcutCallbacks';

/**
 * @param  {BrowserWindow} searchWindow
 * @param  {any} hotKeyAction
 */
const getWorkflowHotkeyPressHandler = ({
  hotKeyAction,
}: {
  hotKeyAction: any;
}) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();
  const actionTypes: string[] = hotKeyAction.action.map(
    (item: any) => item.type
  );

  if (actionTypes.includes('keyword') || actionTypes.includes('scriptfilter')) {
    toggleSearchWindow({ showsUp: true });
  }

  // Force action to be executed after window shows up
  setTimeout(() => {
    searchWindow.webContents.send(IPCMainEnum.executeAction, {
      action: hotKeyAction.action.map((item: any) => {
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
  console.log(`Shortcut registered.. '${shortcut}'`);

  // Double modifier shortcut
  if (shortcut.includes('Double')) {
    const doubledKeyModifier = extractShortcutName(shortcut.split('Double')[1]);

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
    if (globalShortcut.isRegistered(shortcut)) {
      return false;
    }
    globalShortcut.register(shortcut, callback as () => void);
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
    const cb = () => {
      getWorkflowHotkeyPressHandler({
        hotKeyAction: workflowHotkeyTbl[hotkey],
      });
    };

    if (!registerShortcut(hotkey, cb)) {
      dialog.showErrorBox(
        'Duplicated shortcut found',
        `'${hotkey}' duplicated. Please reassign this hotkey`
      );
    }
  }
};

/**
 * @param  {BrowserWindow} preferenceWindow
 * @param  {BrowserWindow} searchWindow
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
    // Case of double key type
    const action = callbackTable[shortcut];

    if (
      !registerShortcut(shortcut, (defaultShortcutCallbackTbl as any)[action]())
    ) {
      dialog.showErrorBox(
        'Duplicated shortcut found',
        `'${shortcut}' duplicated. Please reassign this hotkey`
      );
    }
  }
};
