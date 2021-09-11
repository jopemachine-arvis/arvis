import is from 'electron-is';
import { ipcRenderer, dialog, globalShortcut } from 'electron';
import { Core } from 'arvis-core';
import defaultShortcutCallbackTbl from './defaultShortcutCallbackTable';
import { IPCMainEnum, IPCRendererEnum } from '../../ipc/ipcEventEnum';
import { extractShortcutName } from '../../helper/extractShortcutName';
import toggleSearchWindow from '../../windows/utils/toggleSearchWindow';
import { WindowManager } from '../../windows/windowManager';
import { doubleKeyPressHandlers } from './doubleKeyShortcutCallbacks';

/**
 * In renderer process, double keys should be registered.
 * In main process, remaining keys should be registered.
 * @param hotkeys
 */
const filterTargetHotkeys = (hotkeys: string[]): string[] => {
  return hotkeys.filter(
    (hotkey) => hotkey.toLowerCase().includes('double') === is.renderer()
  );
};

/**
 * @param title
 * @param content
 */
const showErrorDialog = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  if (is.main()) {
    dialog.showErrorBox(title, content);
  } else {
    ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
      title,
      content,
    });
  }
};

/**
 * @param actionTypes
 */
const shouldShowSearchWindow = (actionTypes: string[]) => {
  return (
    actionTypes.includes('keyword') || actionTypes.includes('scriptFilter')
  );
};

/**
 * @param hotKeyAction
 */
const getWorkflowHotkeyPressHandler =
  ({ hotKeyAction }: { hotKeyAction: Command }) =>
  () => {
    const actionTypes: string[] = hotKeyAction.actions!.map(
      (item: any) => item.type
    );

    if (shouldShowSearchWindow(actionTypes)) {
      if (is.renderer()) {
        ipcRenderer.send(IPCRendererEnum.toggleSearchWindow, { showsUp: true });
      } else {
        toggleSearchWindow({ showsUp: false });
      }
    }

    const callback = is.renderer()
      ? () => {
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
        }
      : () => {
          const searchWindow = WindowManager.getInstance().getSearchWindow();
          searchWindow.webContents.send(IPCMainEnum.executeAction, {
            action: hotKeyAction.actions!.map((item: Action) => {
              (item as Command).bundleId = hotKeyAction.bundleId!;
              return item;
            }),
            bundleId: hotKeyAction.bundleId,
          });
        };

    // Force action to be executed after window shows up
    setTimeout(() => {
      callback();
    }, 100);
  };

/**
 * @param shortcut
 * @param callback
 */
export const registerDoubleShortcut = (
  shortcut: string,
  callback: () => void
): boolean => {
  if (!is.renderer()) {
    throw new Error(
      'registerDoubleShortcut should be called in renderer process!'
    );
  }

  const loweredCaseShortcut = shortcut.toLowerCase();

  // Double modifier shortcut should be handled in renderer process.
  if (loweredCaseShortcut.includes('double')) {
    const doubledKeyModifier = extractShortcutName(
      loweredCaseShortcut.split('double')[1]
    ) as 'shift' | 'alt' | 'cmd' | 'ctrl';

    // Already used shortcut
    if ((doubleKeyPressHandlers as any)[doubledKeyModifier]) {
      return false;
    }

    if (process.env.NODE_ENV === 'development') {
      // console.log(
      //   chalk.cyanBright(`Double shortcut registered.. '${shortcut}'`)
      // );
    }

    doubleKeyPressHandlers.set(doubledKeyModifier, callback);
  }

  return true;
};

/**
 * @param shortcut
 * @param callback
 */
export const registerGlobalShortcut = (
  shortcut: string,
  callback: () => void
): boolean => {
  if (!is.main()) {
    throw new Error('registerGlobalShortcut should be called in main process!');
  }

  const loweredCaseShortcut = shortcut.toLowerCase();

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

  return true;
};

/**
 * @param workflowHotkeyTbl
 */
export const registerWorkflowHotkeys = (
  workflowHotkeyTbl: Record<string, Command>
): void => {
  const register = is.renderer()
    ? registerDoubleShortcut
    : registerGlobalShortcut;
  const hotkeys = filterTargetHotkeys(Object.keys(workflowHotkeyTbl));

  for (const hotkey of hotkeys) {
    // Skip hotkey assigning if empty
    if (hotkey.trim() === '') {
      continue;
    }

    const hotkeyPressHandler = getWorkflowHotkeyPressHandler({
      hotKeyAction: workflowHotkeyTbl[hotkey],
    });

    if (!register(hotkey, hotkeyPressHandler)) {
      showErrorDialog({
        title: 'Duplicated Shortcuts Found',
        content: `'${hotkey}' has been assigned as duplicate. Please reassign hotkeys`,
      });
    }
  }
};

/**
 * @param callbackTable
 */
export const registerDefaultGlobalShortcuts = (
  callbackTable: Record<string, string>
): void => {
  const register = is.renderer()
    ? registerDoubleShortcut
    : registerGlobalShortcut;

  const shortcuts = filterTargetHotkeys(Object.keys(callbackTable));

  for (const shortcut of shortcuts) {
    if (
      shortcut.toLowerCase().includes('double') &&
      register !== registerDoubleShortcut
    ) {
      continue;
    }

    const action = callbackTable[shortcut];

    if (!register(shortcut, (defaultShortcutCallbackTbl as any)[action]())) {
      showErrorDialog({
        title: 'Duplicated Shortcuts Found',
        content: `'${shortcut}' has been assigned as duplicate. Please reassign hotkeys`,
      });

      continue;
    }
  }
};
