/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  isAltKey,
  isCtrlKey,
  isMetaKey,
  isShiftKey,
} from '@utils/iohook/keyUtils';
import useIoHook from './useIoHook';

export default () => {
  const ioHook = useIoHook();

  const [alt, setAlt] = useState<boolean>(false);
  const [shift, setShift] = useState<boolean>(false);
  const [meta, setMeta] = useState<boolean>(false);
  const [ctrl, setCtrl] = useState<boolean>(false);

  const onKeydownHandler = (e: IOHookKeyEvent) => {
    if (isAltKey(e)) {
      setAlt(true);
    } else if (isShiftKey(e)) {
      setShift(true);
    } else if (isCtrlKey(e)) {
      setCtrl(true);
    } else if (isMetaKey(e)) {
      setMeta(true);
    }
  };

  const onKeyupHandler = (e: IOHookKeyEvent) => {
    if (isAltKey(e)) {
      setAlt(false);
    } else if (isShiftKey(e)) {
      setShift(false);
    } else if (isCtrlKey(e)) {
      setCtrl(false);
    } else if (isMetaKey(e)) {
      setMeta(false);
    }
  };

  useEffect(() => {
    ioHook.on('keydown', onKeydownHandler);
    ioHook.on('keyup', onKeyupHandler);

    return () => {
      ioHook.off('keydown', onKeydownHandler);
      ioHook.off('keyup', onKeyupHandler);
    };
  }, []);

  return {
    alt,
    shift,
    ctrl,
    meta,
  };
};
