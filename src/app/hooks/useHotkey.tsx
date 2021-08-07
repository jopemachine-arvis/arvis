/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */

import React, { useEffect } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import {
  keyCodeToString,
  stringToKeyCode,
  matchKeyToIoHookKey,
} from '@utils/iohook/keyTbl';
import {
  isAltKey,
  isCtrlKey,
  isMetaKey,
  isShiftKey,
} from '@utils/iohook/modifierKeys';
import { isWithCtrlOrCmd } from '@utils/index';
import { extractShortcutName } from '@helper/extractShortcutName';
import { actionTypes } from '@redux/actions/clipboardHistory';
import {
  doubleKeyPressHandlers,
  singleKeyPressHandlers,
} from '@config/shortcuts/iohookShortcutCallbacks';
import useIoHook, { IOHookKeyEvent } from './useIoHook';

export default (registeredHotkeys: string[]) => {
  const ioHook = useIoHook();

  const doubleKeyPressElapse = 200;

  const doubleKeyPressedTimers = {};

  const handleDoubleKeyModifier = (doubledKeyModifier: string) => {
    if (
      (doubleKeyPressedTimers as any)[doubledKeyModifier] &&
      Date.now() - (doubleKeyPressedTimers as any)[doubledKeyModifier] <
        doubleKeyPressElapse
    ) {
      doubleKeyPressHandlers[
        doubledKeyModifier as 'cmd' | 'shift' | 'alt' | 'ctrl'
      ]!();
    } else {
      (doubleKeyPressedTimers as any)[doubledKeyModifier] =
        new Date().getTime();
    }
  };

  const doubleKeyPressHandler = (e: IOHookKeyEvent) => {
    if (isShiftKey(e)) {
      handleDoubleKeyModifier('shift');
    } else if (isAltKey(e)) {
      handleDoubleKeyModifier('alt');
    } else if (isCtrlKey(e)) {
      handleDoubleKeyModifier('ctrl');
    } else if (isMetaKey(e)) {
      handleDoubleKeyModifier('cmd');
    }
  };

  const isCpyKeyPressed = (e: IOHookKeyEvent) => {
    return (
      isWithCtrlOrCmd({ isWithCmd: e.metaKey, isWithCtrl: e.ctrlKey }) &&
      keyCodeToString(e.keycode) === 'c' &&
      !e.shiftKey &&
      !e.altKey &&
      ((e.metaKey && !e.ctrlKey) || (!e.metaKey && e.ctrlKey))
    );
  };

  const copyKeyPressedHandler = (e: IOHookKeyEvent) => {
    setTimeout(() => {
      const copiedText = clipboard.readText();
      if (copiedText !== '') {
        ipcRenderer.send(IPCRendererEnum.dispatchAction, {
          destWindow: 'clipboardHistoryWindow',
          actionType: actionTypes.PUSH_CLIPBOARD_STORE,
          args: JSON.stringify({
            text: copiedText,
            date: new Date().getTime(),
          }),
        });
      }
    }, 25);
  };

  useEffect(() => {
    ioHook.on('keydown', (e: IOHookKeyEvent) => {
      if (isCpyKeyPressed(e)) {
        copyKeyPressedHandler(e);
        return;
      }

      doubleKeyPressHandler(e);
    });
  }, []);

  useEffect(() => {
    ioHook.unregisterShortcutByKeys();

    for (const hotkey of registeredHotkeys) {
      const keys = extractShortcutName(hotkey) as string[];

      const keycodes = [];
      for (const key of keys) {
        keycodes.push(stringToKeyCode(matchKeyToIoHookKey(key)));
      }

      // Double will be 'undefined', so double modifier keys are filtered here.
      if (!keycodes.includes(undefined)) {
        console.log('Registered keys', keys);
        console.log('Registered keycodes', keycodes);

        ioHook.registerShortcut(
          keycodes,
          singleKeyPressHandlers.get(hotkey.toLowerCase())
        );
      } else {
        //
      }
    }
  }, [registeredHotkeys]);
};
