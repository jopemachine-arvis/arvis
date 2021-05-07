/* eslint-disable no-param-reassign */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable no-restricted-syntax */
import { BrowserWindow, globalShortcut } from 'electron';
import ioHook from 'iohook';
import { Core } from 'wf-creator-core';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import shortcutCallbackTbl from './shortcutCallbackTable';

const ioHookEventHandler = {
  shift: () => {},
  alt: () => {},
  ctrl: () => {},
  cmd: () => {}
};

const doubleKeyPressedTimers = {
  shift: 0,
  alf: 0,
  ctrl: 0,
  meta: 0
};

const getWorkflowHotkeyPressHandler = ({
  searchWindow,
  action
}: {
  searchWindow: BrowserWindow;
  action: any;
}) => {
  // The workManager instance obtained in the main process is a different object
  // from the Singleton object in the renderer process.
  // So, methods like onInputShouldBeUpdate cannot be used here.
  const mainProcWorkManager = Core.WorkManager.getInstance();

  mainProcWorkManager.handleAction({
    actions: [action],
    queryArgs: {},
    modifiersInput: {}
  });

  const actionTypes: string[] = action.action.map((item: any) => item.type);

  if (actionTypes.includes('keyword')) {
    searchWindow.show();
    // ipc를 통해 input을 업데이트할 것.
  }
};

const registerShortcut = (shortcut: string, action: Function) => {
  // Case of double key type
  if (shortcut.includes('Double')) {
    // eslint-disable-next-line prefer-destructuring
    shortcut = shortcut.split('Double ')[1];

    ioHookEventHandler[shortcut] = () => {
      if (Date.now() - doubleKeyPressedTimers[shortcut] < 200) {
        action();
      } else {
        doubleKeyPressedTimers[shortcut] = new Date();
      }
    };
  }
  // Single key (normal shortcut)
  else {
    globalShortcut.register(shortcut, action as () => void);
  }
};

const workflowHotkeyRegistrar = ({
  searchWindow
}: {
  searchWindow: BrowserWindow;
}) => {
  Core.findHotkeys(StoreType.Electron).then(workflowHotkeys => {
    const hotkeys = Object.keys(workflowHotkeys);
    for (const hotkey of hotkeys) {
      const cb = () => {
        getWorkflowHotkeyPressHandler({
          searchWindow,
          action: workflowHotkeys[hotkey]
        });
      };

      registerShortcut(hotkey, cb);
    }
  });
};

export default ({
  preferenceWindow,
  searchWindow,
  callbackTable
}: {
  preferenceWindow: BrowserWindow;
  searchWindow: BrowserWindow;
  callbackTable: any;
}) => {
  const shortcuts = Object.keys(callbackTable);
  workflowHotkeyRegistrar({ searchWindow });

  for (const shortcut of shortcuts) {
    // Case of double key type
    const action = callbackTable[shortcut];

    registerShortcut(
      shortcut,
      shortcutCallbackTbl[action]({ preferenceWindow, searchWindow })
    );
  }

  ioHook.on('keydown', e => {
    if (e.shiftKey) {
      ioHookEventHandler.shift();
    } else if (e.altKey) {
      ioHookEventHandler.alt();
    } else if (e.ctrlKey) {
      ioHookEventHandler.ctrl();
    } else if (e.metaKey) {
      ioHookEventHandler.cmd();
    }
  });
  ioHook.start();
};
