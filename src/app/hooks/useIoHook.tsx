/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import ioHook from 'iohook';
import { ipcRenderer } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';

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

  useEffect(() => {
    // Currently, there is a bug that does not recognize normal keys, but only modifiers are recognized
    ioHook.on('keydown', (e: IOHookKeyEvent) => {
      console.log('ioHook keydown event', e);
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

    return () => {
      ioHook.removeAllListeners();
      ioHook.unload();
    };
  }, []);
};
