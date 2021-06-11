/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import ioHook from 'iohook';
import { ipcRenderer, clipboard, IpcRendererEvent } from 'electron';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { keyCodeToString } from '@utils/iohook/keyTbl';
import { isWithCtrlOrCmd } from '@utils/index';
import { actionTypes } from '@redux/actions/clipboardHistory';

interface IOHookKeyEvent {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  keycode: number;
  type: string;
}

export default () => {
  const doubleKeyPressElapse = 200;

  const doubleKeyPressedTimers = {};

  const handleDoubleKeyModifier = (doubledKeyModifier: string) => {
    if (
      (doubleKeyPressedTimers as any)[doubledKeyModifier] &&
      Date.now() - (doubleKeyPressedTimers as any)[doubledKeyModifier] <
        doubleKeyPressElapse
    ) {
      ipcRenderer.send(IPCRendererEnum.triggerDoubleModifierKey, {
        modifier: doubledKeyModifier,
      });
    } else {
      (doubleKeyPressedTimers as any)[doubledKeyModifier] =
        new Date().getTime();
    }
  };

  const isMetaKey = (e: IOHookKeyEvent) => {
    if (process.platform === 'darwin') {
      return e.keycode === 3675 || e.keycode === 3676;
    }
    return e.metaKey;
  };

  const isAltKey = (e: IOHookKeyEvent) => {
    return e.altKey;
  };

  const isShiftKey = (e: IOHookKeyEvent) => {
    return e.shiftKey;
  };

  const isCtrlKey = (e: IOHookKeyEvent) => {
    return e.ctrlKey;
  };

  const cpyKeyPressed = (e: IOHookKeyEvent) => {
    return (
      (isWithCtrlOrCmd({ isWithCmd: e.metaKey, isWithCtrl: e.ctrlKey }) &&
        keyCodeToString(e.keycode) === 'c' &&
        !isShiftKey(e) &&
        !isAltKey(e) &&
        e.metaKey &&
        !e.ctrlKey) ||
      (!e.metaKey && e.ctrlKey)
    );
  };

  useEffect(() => {
    // Currently, there is a bug that does not recognize normal keys, but only modifiers are recognized
    ioHook.on('keydown', (e: IOHookKeyEvent) => {
      console.log('ioHook keydown event', e);

      if (cpyKeyPressed(e)) {
        setTimeout(() => {
          console.log('hook copy key', clipboard.readText());

          ipcRenderer.send(IPCRendererEnum.dispatchAction, {
            destWindow: 'clipboardHistoryWindow',
            actionType: actionTypes.PUSH_CLIPBOARD_STORE,
            args: JSON.stringify({
              text: clipboard.readText(),
              date: new Date().getTime(),
            }),
          });
        }, 25);
      }

      if (isShiftKey(e)) {
        handleDoubleKeyModifier('shift');
      } else if (isAltKey(e)) {
        handleDoubleKeyModifier('alt');
      } else if (isCtrlKey(e)) {
        handleDoubleKeyModifier('ctrl');
      } else if (isMetaKey(e)) {
        handleDoubleKeyModifier('cmd');
      }
    });

    ioHook.start();

    const triggerKeyCombo = (
      e: IpcRendererEvent,
      { keycombo }: { keycombo: string }
    ) => {
      console.log('emit!');

      // Find new method to dispatching key to os
      // ioHook.emit();
    };

    ipcRenderer.on(IPCMainEnum.triggerKeyDownEvent, triggerKeyCombo);

    return () => {
      ipcRenderer.off(IPCMainEnum.triggerKeyDownEvent, triggerKeyCombo);

      ioHook.removeAllListeners();
      ioHook.unload();
    };
  }, []);
};
