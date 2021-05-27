/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import { globalShortcut, dialog } from 'electron';
import ioHook from 'iohook';
import shortcutCallbackTbl from './shortcutCallbackTable';
import { IPCMainEnum } from './ipcEventEnum';
import { WindowManager } from '../windows';

const doubleKeyPressElapse = 200;

const doubleKeyPressedTimers = {};

const doubleKeyPressHandler: {
  shift?: () => void;
  alt?: () => void;
  ctrl?: () => void;
  cmd?: () => void;
} = {};

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
    searchWindow.show();
  }

  searchWindow.webContents.send(IPCMainEnum.executeAction, {
    action: hotKeyAction.action.map((item: any) => {
      item.bundleId = hotKeyAction.bundleId;
      return item;
    }),
    bundleId: hotKeyAction.bundleId,
  });
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
    if (doubleKeyPressHandler[doubledKeyModifier]) {
      return false;
    }

    doubleKeyPressHandler[doubledKeyModifier] = () => {
      if (
        doubleKeyPressedTimers[doubledKeyModifier] &&
        Date.now() - doubleKeyPressedTimers[doubledKeyModifier] <
          doubleKeyPressElapse
      ) {
        callback();
      } else {
        doubleKeyPressedTimers[doubledKeyModifier] = new Date();
      }
    };
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

    if (!registerShortcut(shortcut, shortcutCallbackTbl[action]())) {
      dialog.showErrorBox(
        'Duplicated shortcut found',
        `'${shortcut}' duplicated. Please reassign this hotkey`
      );
    }
  }

  // Currently, there is a bug that does not recognize normal keys, but only modifiers are recognized
  ioHook.on('keydown', (e) => {
    if (e.shiftKey) {
      doubleKeyPressHandler.shift && doubleKeyPressHandler.shift();
    } else if (e.altKey) {
      doubleKeyPressHandler.alt && doubleKeyPressHandler.alt();
    } else if (e.ctrlKey) {
      doubleKeyPressHandler.ctrl && doubleKeyPressHandler.ctrl();
    } else if (e.metaKey) {
      doubleKeyPressHandler.cmd && doubleKeyPressHandler.cmd();
    }
  });
  ioHook.start();
};
