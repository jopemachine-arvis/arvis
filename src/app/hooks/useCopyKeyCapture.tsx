import React, { useEffect } from 'react';
import { clipboard } from 'electron';
import { keyCodeToString } from '@utils/iohook/keyUtils';
import { isWithCtrlOrCmd } from '@utils/index';
import * as ClipboardHistory from '@store/clipboardHistoryStorage';
import useIoHook from './useIoHook';

export default () => {
  const ioHook = useIoHook();

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
        ClipboardHistory.push({ date: new Date().getTime(), text: copiedText });
      }
    }, 25);
  };

  useEffect(() => {
    ioHook.on('keydown', (e: IOHookKeyEvent) => {
      if (isCpyKeyPressed(e)) {
        copyKeyPressedHandler(e);
      }
    });
  }, []);
};
