/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  isAltKey,
  isCtrlKey,
  isMetaKey,
  isShiftKey,
} from '@utils/iohook/modifierKeys';
import useIoHook, { IOHookKeyEvent } from './useIoHook';

export default () => {
  const ioHook = useIoHook();

  let alt = false;
  let shift = false;
  let ctrl = false;
  let meta = false;

  useEffect(() => {
    ioHook.on('keydown', (e: IOHookKeyEvent) => {
      if (isAltKey(e)) {
        alt = true;
      }
      if (isShiftKey(e)) {
        shift = true;
      }
      if (isCtrlKey(e)) {
        ctrl = true;
      }
      if (isMetaKey(e)) {
        meta = true;
      }
    });

    ioHook.on('keyup', (e: IOHookKeyEvent) => {
      if (isAltKey(e)) {
        alt = false;
      }
      if (isShiftKey(e)) {
        shift = false;
      }
      if (isCtrlKey(e)) {
        ctrl = false;
      }
      if (isMetaKey(e)) {
        meta = false;
      }
    });
  }, []);

  return {
    alt,
    shift,
    ctrl,
    meta,
  };
};
