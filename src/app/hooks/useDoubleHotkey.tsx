/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */

import React, { useEffect } from 'react';
import {
  isAltKey,
  isCtrlKey,
  isMetaKey,
  isShiftKey,
} from '@utils/iohook/keyUtils';
import { doubleKeyPressHandlers } from '@config/shortcuts/iohookShortcutCallbacks';
import useIoHook from './useIoHook';
import { isDoubleKeyPressed } from './utils/doubleKeyUtils';

const doubleKeyPressedTimers = {};

export default () => {
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

  useEffect(() => {
    ioHook.on('keydown', doubleKeyPressHandler);
  }, []);
};
