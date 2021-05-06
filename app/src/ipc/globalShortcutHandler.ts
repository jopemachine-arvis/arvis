/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
import { BrowserWindow, globalShortcut } from 'electron';
import ioHook from 'iohook';
import shortcutCallbackTbl from './shortcutCallbackTable';

const doubleKeyPressedTimers = {
  shift: 0,
  alf: 0,
  ctrl: 0,
  meta: 0
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
  let doubleShiftPressHandler = () => {};
  let doubleAltPressHandler = () => {};
  let doubleCtrlPressHandler = () => {};
  let doubleMetaPressHandler = () => {};

  for (let shortcut of shortcuts) {
    // Case of double key type
    const action = callbackTable[shortcut];
    if (shortcut.includes('Double')) {
      // eslint-disable-next-line prefer-destructuring
      shortcut = shortcut.split('Double ')[1];

      const createCallback = () => {
        if (Date.now() - doubleKeyPressedTimers[shortcut] < 200) {
          shortcutCallbackTbl[action]({ preferenceWindow, searchWindow })();
        } else {
          doubleKeyPressedTimers[shortcut] = new Date();
        }
      };

      switch (shortcut) {
        case 'cmd':
          doubleMetaPressHandler = createCallback;
          break;
        case 'shift':
          doubleShiftPressHandler = createCallback;
          break;
        case 'ctrl':
          doubleCtrlPressHandler = createCallback;
          break;
        case 'alt':
          doubleAltPressHandler = createCallback;
          break;
      }
    }
    // Single key (normal shortcut)
    else {
      globalShortcut.register(
        shortcut,
        shortcutCallbackTbl[action]({ preferenceWindow, searchWindow })
      );
    }
  }

  ioHook.on('keydown', e => {
    if (e.shiftKey) {
      doubleShiftPressHandler();
    } else if (e.altKey) {
      doubleAltPressHandler();
    } else if (e.ctrlKey) {
      doubleCtrlPressHandler();
    } else if (e.metaKey) {
      doubleMetaPressHandler();
    }
  });
  ioHook.start();
};
