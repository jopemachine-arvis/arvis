import React, { useEffect, useRef } from 'react';
import { isWithCtrlOrCmd } from '@utils/index';
import _ from 'lodash';
import useKey from '../../external/use-key-capture/src';

/**
 * @description
 */
const useStoreSearchControl = ({
  items,
  setItems,
  originalItems,
}: {
  items: any[];
  setItems: (items: any[]) => void;
  originalItems: any[];
}) => {
  const { keyData, getTargetProps } = useKey();
  const { originalRef: inputRef } = getTargetProps();

  const originalItemsRef = useRef<any[]>(originalItems);

  /**
   */
  const focusSearchbar = () => {
    if (inputRef.current) {
      (inputRef.current! as HTMLInputElement).focus();
    }
  };

  /**
   */
  const handleNormalInput = async (
    _originalItems: any[],
    pressedKey: string,
    updatedInput: string
  ) => {
    const newItems = [];

    for (const item of _originalItems) {
      if (
        item.name.toLowerCase().includes(updatedInput.toLowerCase()) ||
        item.description.toLowerCase().includes(updatedInput.toLowerCase())
      ) {
        newItems.push(item);
      }
    }

    setItems(newItems);
  };

  useEffect(() => {
    handleNormalInput(
      originalItems,
      '',
      (document.getElementById('searchBar') as HTMLInputElement).value
    );
  }, [originalItems]);

  /**
   * @param str
   */
  const setInputStr = (str: string) => {
    if (inputRef && inputRef.current) {
      (inputRef.current! as HTMLInputElement).value = str;
    }
  };

  /**
   * @param e
   */
  const onKeyupHandler = (e: KeyboardEvent) => {
    const exceptionKeys = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Control',
      'Meta',
      'Alt',
      'Shift',
      'CapsLock',
      'Tab',
      'Escape',
    ];

    if (!exceptionKeys.includes(e.key)) {
      const txt = (inputRef.current! as HTMLInputElement).value!
        ? (inputRef.current! as HTMLInputElement).value
        : '';

      handleNormalInput(originalItemsRef.current, e.key, txt);
    }
  };

  /**
   */
  const onKeydownHandler = async () => {
    const input: string | undefined | null = keyData.key;

    const ctrlOrCmdKeyPressed = isWithCtrlOrCmd({
      isWithCmd: keyData.isWithMeta,
      isWithCtrl: keyData.isWithCtrl,
    });

    const searchByNextInput = () =>
      setTimeout(
        () =>
          handleNormalInput(
            originalItemsRef.current,
            '',
            (document.getElementById('searchBar') as HTMLInputElement).value
          ),
        25
      );

    if (keyData.isArrowDown) {
      // To do :: add here
    } else if (keyData.isArrowUp) {
      // To do :: add here
    } else if (keyData.isEscape) {
      // To do :: add here
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'V') {
      searchByNextInput();
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'Z') {
      searchByNextInput();
    }
  };

  useEffect(() => {
    originalItemsRef.current = originalItems;
  });

  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current! as HTMLInputElement).onkeyup = onKeyupHandler;
    }
  }, []);

  useEffect(() => {
    // Ignore Initial Mount
    if (_.isNull(keyData.key)) return;

    onKeydownHandler();
  }, [keyData]);

  return {
    setInputStr,
    focusSearchbar,
    getInputProps: getTargetProps,
  };
};

export default useStoreSearchControl;
