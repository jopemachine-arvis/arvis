/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lonely-if */
import React, { useEffect, useRef } from 'react';
import { isWithCtrlOrCmd } from '@utils/index';
import _ from 'lodash';
import { Core } from 'arvis-core';
import alphaSort from 'alpha-sort';
import useKey from '../../external/use-key-capture/src';

/**
 */
const useExtensionSearchControl = ({
  items,
  setItems,
  originalItems,
  extensionInfos,
}: {
  items: any[];
  setItems: (items: any[]) => void;
  originalItems: any[];
  extensionInfos: any;
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
   * @param _originalItems
   * @param pressedKey
   * @param updatedInput
   */
  const handleNormalInput = async (
    _originalItems: any[],
    pressedKey: string,
    updatedInput: string
  ) => {
    const newItems = [];

    for (const bundleId of Object.keys(extensionInfos)) {
      if (
        (extensionInfos[bundleId].name &&
          extensionInfos[bundleId].name
            .toLowerCase()
            .includes(updatedInput.toLowerCase())) ||
        (extensionInfos[bundleId].description &&
          extensionInfos[bundleId].description
            .toLowerCase()
            .includes(updatedInput.toLowerCase()))
      ) {
        newItems.push(bundleId);
      }
    }

    setItems(
      newItems.sort((a, b) =>
        alphaSort({
          natural: true,
          caseInsensitive: true,
        })(Core.getNameFromBundleId(a), Core.getNameFromBundleId(b))
      )
    );
  };

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

    if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'V') {
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

export default useExtensionSearchControl;
