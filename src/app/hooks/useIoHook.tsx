/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import ioHook from 'iohook';
import { ipcRenderer } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';

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
      (doubleKeyPressedTimers as any)[doubledKeyModifier] = new Date();
    }
  };

  useEffect(() => {
    // Currently, there is a bug that does not recognize normal keys, but only modifiers are recognized
    ioHook.on('keydown', (e) => {
      if (e.shiftKey) {
        handleDoubleKeyModifier('shift');
      } else if (e.altKey) {
        handleDoubleKeyModifier('alt');
      } else if (e.ctrlKey) {
        handleDoubleKeyModifier('ctrl');
      } else if (e.metaKey) {
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
