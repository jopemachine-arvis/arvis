/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
    const isDouble =
      isDoubleKeyPressed('alt') ||
      isDoubleKeyPressed('ctrl') ||
      isDoubleKeyPressed('meta') ||
      isDoubleKeyPressed('shift');

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
