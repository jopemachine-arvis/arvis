/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */

import React, { useEffect } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import {
  isAltKey,
  isCtrlKey,
  isMetaKey,
  isShiftKey,
  keyCodeToString,
  stringToKeyCode,
  matchKeyToIoHookKey,
} from '@utils/iohook/keyUtils';
import { isWithCtrlOrCmd } from '@utils/index';
import { extractShortcutName } from '@helper/extractShortcutName';
import { actionTypes } from '@redux/actions/clipboardHistory';
import {
  doubleKeyPressHandlers,
  singleKeyPressHandlers,
} from '@config/shortcuts/iohookShortcutCallbacks';
import useIoHook from './useIoHook';

import { isDoubleKeyPressed } from './utils/doubleKeyUtils';

const doubleKeyPressedTimers = {};

export default (registeredHotkeys: string[]) => {
  const ioHook = useIoHook();

  const handleDoubleKeyModifier = (
    doubledKeyModifier: 'cmd' | 'shift' | 'alt' | 'ctrl'
  ) => {
    if (isDoubleKeyPressed(doubleKeyPressedTimers, doubledKeyModifier)) {
      if (doubleKeyPressHandlers.has(doubledKeyModifier)) {
        doubleKeyPressHandlers.get(doubledKeyModifier)!();
      }
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
    ioHook.unregisterAllShortcuts();

    for (const hotkey of registeredHotkeys) {
      const keys = extractShortcutName(hotkey) as string[];
      const keycodes = keys.map((key) =>
        stringToKeyCode(matchKeyToIoHookKey(key))
      );

      // Double will be 'undefined', so double modifier keys are filtered here.
      if (!keycodes.includes(undefined)) {
        console.log('Registered keys', keys);
        console.log('Registered keycodes', keycodes);

        if (!singleKeyPressHandlers.has(hotkey.toLowerCase())) {
          throw new Error(`${hotkey} is registered but not found in handlers!`);
        }

        ioHook.registerShortcut(
          keycodes,
          singleKeyPressHandlers.get(hotkey.toLowerCase())!
        );
      } else {
        //
      }
    }
  }, [registeredHotkeys]);
};
