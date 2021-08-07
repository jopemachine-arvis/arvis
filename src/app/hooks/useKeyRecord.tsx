/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  isAltKey,
  isCtrlKey,
  isMetaKey,
  isShiftKey,
} from '@utils/iohook/keyUtils';
import useIoHook, { IOHookKeyEvent } from './useIoHook';
import { isDoubleKeyPressed } from './utils/doubleKeyUtils';

type IProps = {
  actived: boolean;
};

type RecorededKeyData = IOHookKeyEvent & {
  doubleKeyPressed: boolean;
};

export default (props: IProps) => {
  const { actived } = props;

  const ioHook = useIoHook();

  const [recordedKeyData, setRecoredKeyData] =
    useState<RecorededKeyData | undefined>(undefined);

  const useKeyRecord = (e: IOHookKeyEvent) => {
    let isDouble = false;

    if (isAltKey(e)) {
      isDouble = isDoubleKeyPressed('alt');
    } else if (isCtrlKey(e)) {
      isDouble = isDoubleKeyPressed('ctrl');
    } else if (isMetaKey(e)) {
      isDouble = isDoubleKeyPressed('meta');
    } else if (isShiftKey(e)) {
      isDouble = isDoubleKeyPressed('shift');
    }

    console.log('isDouble', isDouble);
    setRecoredKeyData({
      ...e,
      doubleKeyPressed: isDouble,
    });
  };

  useEffect(() => {
    if (actived) {
      ioHook.on('keydown', useKeyRecord);
    } else {
      ioHook.off('keydown', useKeyRecord);
    }
  }, [actived]);

  return {
    recordedKeyData,
  };
};
