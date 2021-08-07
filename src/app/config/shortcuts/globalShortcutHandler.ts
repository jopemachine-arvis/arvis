/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import chalk from 'chalk';
import { ipcRenderer } from 'electron';
import { Core } from 'arvis-core';
import defaultShortcutCallbackTbl from './defaultShortcutCallbackTable';
import { IPCRendererEnum } from '../../ipc/ipcEventEnum';
import { extractShortcutName } from '../../helper/extractShortcutName';
import {
  singleKeyPressHandlers,
  doubleKeyPressHandlers,
} from './iohookShortcutCallbacks';

/**
 * @param hotKeyAction
 */
const getWorkflowHotkeyPressHandler = ({
  hotKeyAction,
}: {
  hotKeyAction: Command;
}) => {
  const actionTypes: string[] = hotKeyAction.actions!.map(
    (item: any) => item.type
  );

  if (actionTypes.includes('keyword') || actionTypes.includes('scriptFilter')) {
    ipcRenderer.send(IPCRendererEnum.toggleSearchWindow, { showsUp: true });
  }

  // Force action to be executed after window shows up
  setTimeout(() => {
    const actionFlowManager = Core.ActionFlowManager.getInstance();

    actionFlowManager.isInitialTrigger = false;
    actionFlowManager.handleItemPressEvent(
      {
        actions: hotKeyAction.actions!.map((item: Action) => {
          (item as Command).bundleId = hotKeyAction.bundleId!;
          return item;
        }),
        bundleId: hotKeyAction.bundleId,
        type: 'hotkey',
        title: '',
      },
      '',
      { normal: true }
    );
  }, 100);
};

/**
 * @param shortcut
 * @param callback
 */
const registerShortcut = (shortcut: string, callback: () => void): boolean => {
  console.log(chalk.cyanBright(`Shortcut registered.. '${shortcut}'`));

  const loweredCaseShortcut = shortcut.toLowerCase();

  // Double modifier shortcut
  if (loweredCaseShortcut.includes('double')) {
    const doubledKeyModifier = extractShortcutName(
      loweredCaseShortcut.split('double')[1]
    ) as string;

    // Already used shortcut
    if ((doubleKeyPressHandlers as any)[doubledKeyModifier]) {
      return false;
    }

    doubleKeyPressHandlers[
      doubledKeyModifier as 'shift' | 'alt' | 'cmd' | 'ctrl'
    ] = callback;
  }
  // Normal modifier shortcut
  else if (!singleKeyPressHandlers.has(loweredCaseShortcut)) {
    singleKeyPressHandlers.set(loweredCaseShortcut, callback as () => void);
  } else {
    ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
      title: 'Invalid Shortcut Assign',
      content: `'${loweredCaseShortcut}' is not invalid hotkeys. Please reassign this hotkey`,
    });
  }

  return true;
};

/**
 * @param workflowHotkeyTbl
 */
const registerWorkflowHotkeys = ({
  workflowHotkeyTbl,
}: {
  workflowHotkeyTbl: Record<string, Command>;
}) => {
  const registered = [];
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
      ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
        title: 'Duplicated Shortcuts Found',
        content: `'${hotkey}' has been assigned as duplicate. Please reassign hotkeys`,
      });
    }

    registered.push(hotkey);
  }

  return registered;
};

/**
 * @param callbackTable
 * @param workflowHotkeyTbl
 */
export default ({
  callbackTable,
  workflowHotkeyTbl,
}: {
  callbackTable: Record<string, string>;
  workflowHotkeyTbl: Record<string, Command>;
}) => {
  const shortcuts = Object.keys(callbackTable);

  const registeredHotkeys = registerWorkflowHotkeys({ workflowHotkeyTbl });

  for (const shortcut of shortcuts) {
    const action = callbackTable[shortcut];

    if (
      !registerShortcut(shortcut, (defaultShortcutCallbackTbl as any)[action]())
    ) {
      ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
        title: 'Duplicated Shortcuts Found',
        content: `'${shortcut}' has been assigned as duplicate. Please reassign hotkeys`,
      });

      continue;
    }

    registeredHotkeys.push(shortcut);
  }

  return registeredHotkeys;
};
