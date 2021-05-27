/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import { BrowserWindow, globalShortcut, Notification, dialog } from 'electron';
import ioHook from 'iohook';
import { Core } from 'arvis-core';
import shortcutCallbackTbl from './shortcutCallbackTable';
import { IPCMainEnum } from './ipcEventEnum';
import { WindowManager } from '../windows';

const doubleKeyPressElapse = 200;

const doubleKeyPressedTimers = {};

const doubleKeyPressHandler: {
  shift: (() => void) | undefined;
  alt: (() => void) | undefined;
  ctrl: (() => void) | undefined;
  cmd: (() => void) | undefined;
} = {
  shift: undefined,
  alt: undefined,
  ctrl: undefined,
  cmd: undefined,
};

/**
 * @param  {any} hotKeyAction
 * @param  {string[]} actionTypes
 * @summary handle custom actions
 */
const handleGUICustomActions = (hotKeyAction: any, actionTypes: string[]) => {
  if (actionTypes.includes('notification')) {
    // Assume action count is 1
    const targetAction = hotKeyAction.action.filter(
      (item: any) => item.type === 'notification'
    )[0];

    new Notification({
      title: targetAction.title,
      body: targetAction.text,
    }).show();
  }
};

/**
 * @param  {BrowserWindow} searchWindow
 * @param  {any} hotKeyAction
 * @param  {string[]} actionTypes
 */
const handleHotKeyAction = (
  searchWindow: BrowserWindow,
  hotKeyAction: any,
  actionTypes: string[]
) => {
  if (actionTypes.includes('keyword') || actionTypes.includes('scriptfilter')) {
    const targetAction = hotKeyAction.action.filter(
      (item: any) => item.type === 'keyword' || item.type === 'scriptfilter'
    )[0];

    searchWindow.show();

    const newInput = targetAction.command;

    searchWindow.webContents.send(IPCMainEnum.setSearchbarInput, {
      str: newInput,
    });
  }

  // handle custom actions
  handleGUICustomActions(hotKeyAction, actionTypes);
};

/**
 * @param  {BrowserWindow} searchWindow
 * @param  {any} hotKeyAction
 */
const getWorkflowHotkeyPressHandler = ({
  searchWindow,
  hotKeyAction,
}: {
  searchWindow: BrowserWindow;
  hotKeyAction: any;
}) => {
  // The workManager instance obtained in the main process is a different object
  // from the Singleton object in the renderer process.
  // So, methods like onInputShouldBeUpdate cannot be used here
  // and GUI custom actions (notifications) should be handled here
  Core.WorkManager.getInstance();

  Core.handleAction({
    actions: [hotKeyAction],
    queryArgs: {},
    modifiersInput: {},
  });

  const actionTypes: string[] = hotKeyAction.action.map(
    (item: any) => item.type
  );

  handleHotKeyAction(searchWindow, hotKeyAction, actionTypes);
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
  const searchWindow = WindowManager.getInstance().getSearchWindow();
  const hotkeys = Object.keys(workflowHotkeyTbl);
  for (const hotkey of hotkeys) {
    const cb = () => {
      getWorkflowHotkeyPressHandler({
        searchWindow,
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
