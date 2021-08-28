/* eslint-disable no-restricted-syntax */
import React from 'react';
import useClipboardHistory from './useClipboardHistory';

/**
 */
const useAssistanceMode = ({
  mode,
  maxShowOnScreen,
  maxShowOnWindow,
  renewHandler,
}: {
  mode: string;
  maxShowOnScreen: number;
  maxShowOnWindow: number;
  renewHandler: () => void;
}) => {
  let items: any[] = [];
  let originalItems: any[] = [];
  let setOriginalItems: any;
  let setItems: any;

  const {
    items: clItems,
    originalItems: clOriginalItems,
    setItems: clSetItems,
    setOriginalItems: clSetOriginalItems,
  } = useClipboardHistory({
    mode,
    maxShowOnScreen,
    maxShowOnWindow,
    renewHandler,
  });

  switch (mode) {
    case 'clipboardHistory':
      items = clItems as any[];
      originalItems = clOriginalItems as any[];
      setItems = clSetItems;
      setOriginalItems = clSetOriginalItems;
      break;
    case 'universalAction':
      break;
    default:
      throw new Error('Unsupported type of assistance window');
  }

  return {
    items,
    setItems,
    originalItems,
    setOriginalItems,
  };
};

export default useAssistanceMode;
