import React, { useEffect, useRef, useState } from 'react';
import {
  isAltKey,
  isCtrlKey,
  isMetaKey,
  isShiftKey,
} from '@utils/iohook/keyUtils';
import useIoHook from './useIoHook';
import { isDoubleKeyPressed } from './utils/doubleKeyUtils';

type IProps = {
  actived: boolean;
};

type RecorededKeyData = IOHookKeyEvent & {
  doubleKeyPressed: boolean;
};

const doubleKeyPressedTimers = {};

export default (props: IProps) => {
  const { actived } = props;
  const activedRef = useRef<boolean>(actived);

  const ioHook = useIoHook();

  const [recordedKeyData, setRecoredKeyData] = useState<RecorededKeyData>({
    keycode: -1,
    altKey: false,
    ctrlKey: false,
    doubleKeyPressed: false,
    metaKey: false,
    shiftKey: false,
    type: 'keydown',
  });

  const startRecord = (e: IOHookKeyEvent) => {
    if (!activedRef.current) return;

    let isDouble = false;

    if (isAltKey(e)) {
      isDouble = isDoubleKeyPressed(doubleKeyPressedTimers, 'alt');
    } else if (isCtrlKey(e)) {
      isDouble = isDoubleKeyPressed(doubleKeyPressedTimers, 'ctrl');
    } else if (isMetaKey(e)) {
      isDouble = isDoubleKeyPressed(doubleKeyPressedTimers, 'meta');
    } else if (isShiftKey(e)) {
      isDouble = isDoubleKeyPressed(doubleKeyPressedTimers, 'shift');
    }

    setRecoredKeyData({
      ...e,
      doubleKeyPressed: isDouble,
    });
  };

  useEffect(() => {
    ioHook.on('keydown', startRecord);
    return () => {
      ioHook.off('keydown', startRecord);
    };
  }, []);

  useEffect(() => {
    activedRef.current = actived;
  }, [actived]);

  return {
    recordedKeyData,
  };
};
