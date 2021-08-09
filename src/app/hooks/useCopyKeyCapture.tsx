/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */

import React, { useEffect } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { keyCodeToString } from '@utils/iohook/keyUtils';
import { isWithCtrlOrCmd } from '@utils/index';
import { actionTypes } from '@redux/actions/clipboardHistory';
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
      }
    });
  }, []);
};
