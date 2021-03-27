import React, { useState } from 'react';
import { Core } from 'wf-creator-core';
import useKey from 'use-key-capture';

const maxItemCount = 5;

type IIndexInfos = {
  selectedItemIdx: number;
  itemStartIdx: number;
};

const useControl = ({
  items,
  commandManager
}: {
  items: any[];
  commandManager: Core.CommandManager;
}) => {
  const [inputStr, setInputStr] = useState<string>('');
  const [indexInfo, setIndexInfo] = useState<IIndexInfos>({
    itemStartIdx: 0,
    selectedItemIdx: 0
  });

  const clearInput = () => {
    setInputStr('');
  };

  const handleReturn = async (modifiers: any) => {
    try {
      await commandManager.commandExcute(
        items[indexInfo.selectedItemIdx],
        inputStr,
        modifiers
      );
      setInputStr('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpArrow = () => {
    const selectedItemIdx =
      (indexInfo.selectedItemIdx - 1 + items.length) % items.length;

    if (selectedItemIdx === items.length - 1) {
      setIndexInfo({
        itemStartIdx: items.length - maxItemCount,
        selectedItemIdx: items.length - 1
      });
    } else if (indexInfo.itemStartIdx > selectedItemIdx) {
      setIndexInfo({
        itemStartIdx: indexInfo.itemStartIdx - 1,
        selectedItemIdx
      });
    } else {
      setIndexInfo({
        itemStartIdx: indexInfo.itemStartIdx,
        selectedItemIdx
      });
    }
  };

  const handleDownArrow = () => {
    const selectedItemIdx = (indexInfo.selectedItemIdx + 1) % items.length;
    if (selectedItemIdx === 0) {
      setIndexInfo({
        itemStartIdx: 0,
        selectedItemIdx: 0
      });
    } else if (indexInfo.itemStartIdx + maxItemCount <= selectedItemIdx) {
      setIndexInfo({
        itemStartIdx: indexInfo.itemStartIdx + 1,
        selectedItemIdx
      });
    } else {
      setIndexInfo({
        itemStartIdx: indexInfo.itemStartIdx,
        selectedItemIdx
      });
    }
  };

  const handleNormalInput = (
    input: string,
    updatedInput: string,
    modifiers: any
  ) => {
    setInputStr(updatedInput);

    // Assume withspace's default value is true
    if (items.length !== 0) {
      if (items[0].type === 'scriptfilter') {
        const cond1 =
          items[0].withspace === false && updatedInput === items[0].command;
        const cond2 =
          items[0].withspace === true &&
          updatedInput.includes(items[0].command) &&
          input !== ' ';

        if (cond1 || cond2) {
          try {
            commandManager.scriptFilterExcute(
              items[indexInfo.selectedItemIdx],
              updatedInput
            );
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  };

  const { keyData, getTargetProps } = useKey();

  const onKeydown = async (e: any) => {
    // const key, input ;
    const input = keyData.key;
    let updatedInput = inputStr + input;

    const modifiers = {
      ctrl: keyData.isWithCtrl,
      shift: keyData.isWithShift,
      cmd: false
    };

    if (keyData.isBackspace) {
      updatedInput = inputStr.substr(0, inputStr.length - 1);
      setInputStr(updatedInput);
    } else if (keyData.isEnter) {
      await handleReturn(modifiers);
    } else if (keyData.isArrowDown) {
      handleDownArrow();
    } else if (keyData.isArrowUp) {
      handleUpArrow();
    } else if (keyData.isEscape) {
      console.log('esc~');
    } else {
      handleNormalInput(input, updatedInput, modifiers);
    }
  };

  return {
    inputStr,
    indexInfo,
    clearInput
  };
};

export { useControl, maxItemCount };
