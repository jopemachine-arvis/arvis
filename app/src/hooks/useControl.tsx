/* eslint-disable no-restricted-syntax */
/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import useKey from '../../use-key-capture/_dist/index';
import { extractJson } from '../utils';

type IndexInfo = {
  selectedItemIdx: number;
  itemStartIdx: number;
};

const allIsFalse = (obj: any) => {
  for (const key of Object.keys(obj)) {
    if (obj[key] === true) return false;
  }
  return true;
};

const useControl = ({
  items,
  maxItemCount,
  setErrorItem,
  setRunningText,
  commandManager
}: {
  items: any[];
  maxItemCount: number;
  setErrorItem: Function;
  setRunningText: Function;
  commandManager: Core.CommandManager;
}) => {
  const { keyData, getTargetProps, resetKeyData } = useKey();

  const [shouldBeHided, setShouldBeHided] = useState<boolean>(false);

  const [inputStr, setInputStr] = useState<string>('');
  const [indexInfo, setIndexInfo] = useState<IndexInfo>({
    itemStartIdx: 0,
    selectedItemIdx: 0
  });

  const clearInput = () => {
    setInputStr('');
    resetKeyData();
  };

  const clearIndexInfo = () => {
    setIndexInfo({
      itemStartIdx: 0,
      selectedItemIdx: 0
    });
  };

  const handleWorkflowError = (err: any) => {
    const possibleJsons = extractJson(err.toString());
    const errors = possibleJsons.filter(item => item.items);

    const errorItems = _.reduce(
      errors,
      (ret: any, errorObj: any) => {
        ret.push(errorObj.items[0]);
        return ret;
      },
      []
    );

    setErrorItem(err, errorItems);
  };

  const handleReturn = async (modifiers: any) => {
    const selectedItem = items[indexInfo.selectedItemIdx];
    if (selectedItem.type === 'scriptfilter') {
      setInputStr(selectedItem.command);

      const { running_subtext: runningSubText } = items[
        indexInfo.selectedItemIdx
      ];
      setRunningText({ index: indexInfo.selectedItemIdx, runningSubText });

      commandManager
        .scriptFilterExcute(
          selectedItem.command,
          items[indexInfo.selectedItemIdx]
        )
        .catch(handleWorkflowError);
    } else {
      await commandManager
        .commandExcute(selectedItem, inputStr, modifiers)
        .catch((err: any) => {
          console.error('Error occured in commandExecute!', err);
        });
      clearInput();
    }

    // May or may not be needed.. case by case
    // clearInput();
  };

  const handleUpArrow = () => {
    const selectedItemIdx =
      (indexInfo.selectedItemIdx - 1 + items.length) % items.length;

    // Select most bottom item
    if (selectedItemIdx === items.length - 1 && items.length !== 1) {
      setIndexInfo({
        itemStartIdx: items.length - maxItemCount,
        selectedItemIdx: items.length - 1
      });
    }
    // Select up
    else if (indexInfo.itemStartIdx > selectedItemIdx) {
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

    // Select most upper item
    if (selectedItemIdx === 0) {
      clearIndexInfo();
    }
    // Select down
    else if (indexInfo.itemStartIdx + maxItemCount <= selectedItemIdx) {
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
      // When script filter is running
      const onScriptFilter = !commandManager.hasEmptyCommandStk();

      // When script filter is not running (and should be running)
      const goScriptFilterWithSpace =
        items[0].withspace === true &&
        updatedInput.includes(items[0].command) &&
        input !== ' ';

      const goScriptFilterWithoutSpace =
        items[0].withspace === false && updatedInput.includes(items[0].command);

      let commandOnStackIsEmpty;
      if (goScriptFilterWithSpace || goScriptFilterWithoutSpace) {
        commandOnStackIsEmpty = items[indexInfo.selectedItemIdx];
      }

      if (
        onScriptFilter ||
        goScriptFilterWithSpace ||
        goScriptFilterWithoutSpace
      ) {
        const { running_subtext: runningSubText } = items[
          indexInfo.selectedItemIdx
        ];
        setRunningText({ index: indexInfo.selectedItemIdx, runningSubText });

        commandManager
          .scriptFilterExcute(updatedInput, commandOnStackIsEmpty)
          .catch(handleWorkflowError);
      }

      clearIndexInfo();
    }
  };

  const onScrollHandler = (e: any) => {
    if (e.deltaY > 0) {
      if (indexInfo.itemStartIdx + maxItemCount < items.length) {
        setIndexInfo({
          itemStartIdx: indexInfo.itemStartIdx + 1,
          selectedItemIdx: indexInfo.selectedItemIdx
        });
      }
    } else {
      if (indexInfo.itemStartIdx > 0) {
        setIndexInfo({
          itemStartIdx: indexInfo.itemStartIdx - 1,
          selectedItemIdx: indexInfo.selectedItemIdx
        });
      }
    }
  };

  const onMouseoverHandler = (index: number) => {
    setIndexInfo({
      itemStartIdx: indexInfo.itemStartIdx,
      selectedItemIdx: index
    });
  };

  const onDoubleClickHandler = (index: number) => {
    handleReturn({
      cmd: false,
      ctrl: false,
      shift: false
    });
  };

  const cleanUpBeforeHide = () => {
    clearInput();
    clearIndexInfo();
    commandManager.clearCommandStack();
    setShouldBeHided(true);
  };

  const onKeydown = async () => {
    const input = keyData.key;
    let updatedInput = inputStr + input;

    const modifiers = {
      // On mac, cmd key is handled by meta;
      cmd: keyData.isWithMeta,
      ctrl: keyData.isWithCtrl,
      shift: keyData.isWithShift,
      alt: keyData.isWithAlt
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
      cleanUpBeforeHide();
    } else if (!keyData.isSpecialCharacter) {
      handleNormalInput(input, updatedInput, modifiers);
    }
  };

  useEffect(() => {
    ipcRenderer.on('hide-search-window-by-blur-event', () => {
      cleanUpBeforeHide();
    });
  }, []);

  useEffect(() => {
    // Ignore Initial Mount
    if (keyData.key === null) return;
    onKeydown();
  }, [keyData]);

  useEffect(() => {
    // After cleanUp
    if (shouldBeHided === true && items.length === 0) {
      // Give some time to remove Afterimage
      setTimeout(() => {
        ipcRenderer.send('hide-search-window');
      }, 10);
      setShouldBeHided(false);
    }
  }, [shouldBeHided, items]);

  return {
    inputStr,
    setInputStr,
    indexInfo,
    clearInput,
    clearIndexInfo,
    onScrollHandler,
    onMouseoverHandler,
    onDoubleClickHandler,
    getInputProps: getTargetProps
  };
};

export default useControl;
