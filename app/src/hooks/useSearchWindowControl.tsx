/* eslint-disable promise/always-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import useKey from '../../use-key-capture/src';
import { extractJson, checkObjectsAllValue } from '../utils';

type IndexInfo = {
  selectedItemIdx: number;
  itemStartIdx: number;
};

const useSearchWindowControl = ({
  items,
  setItems,
  maxItemCount,
  workManager
}: {
  items: any[];
  setItems: Function;
  maxItemCount: number;
  workManager: Core.WorkManager;
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

  const setRunningText = ({
    itemArr,
    index,
    runningSubText
  }: {
    itemArr: any[];
    index: number;
    runningSubText: string;
  }) => {
    const swap = itemArr;
    swap[index] = {
      ...itemArr[index],
      subtitle: runningSubText
    };
    setItems(swap);
  };

  const setErrorItem = (err: any, errorItems: any[]) => {
    if (errorItems.length !== 0) {
      setItems(errorItems);
    } else {
      setItems([
        {
          valid: false,
          title: err.name,
          subtitle: err.message,
          text: {
            copy: err.message,
            largetype: err.message
          }
        }
      ]);
    }
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

      setRunningText({
        itemArr: items,
        index: indexInfo.selectedItemIdx,
        runningSubText
      });

      workManager
        .scriptFilterExcute(
          selectedItem.command,
          items[indexInfo.selectedItemIdx]
        )
        .catch(handleWorkflowError);
    } else {
      await workManager
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

  const handleScriptFilterAutoExecute = ({
    itemArr,
    input,
    updatedInput
  }: {
    itemArr: any[];
    input: string;
    updatedInput: string;
  }) => {
    let commandOnStackIsEmpty;

    // Assume withspace's default value is true
    // When script filter is not running (and should be running)
    if (itemArr.length > 0) {
      // auto script filter executing should be started from first item
      const firstItem = itemArr[0];

      const goScriptFilterWithSpace =
        firstItem.withspace === true &&
        updatedInput.includes(firstItem.command) &&
        input !== ' ';

      const goScriptFilterWithoutSpace =
        firstItem.withspace === false &&
        updatedInput.includes(firstItem.command);

      if (goScriptFilterWithSpace || goScriptFilterWithoutSpace) {
        // eslint-disable-next-line prefer-destructuring
        commandOnStackIsEmpty = firstItem;

        const { running_subtext: runningSubText } = firstItem;
        setRunningText({
          itemArr,
          index: 0,
          runningSubText
        });

        workManager
          .scriptFilterExcute(updatedInput, commandOnStackIsEmpty)
          .catch(handleWorkflowError);
      }
    }
  };

  const handleNormalInput = (
    input: string,
    updatedInput: string,
    modifiers: any
  ) => {
    setInputStr(updatedInput);
    const assumedCommand = updatedInput.split(' ')[0];

    const searchCommands = () => {
      Core.findCommands(StoreType.Electron, assumedCommand)
        .then((result: any) => {
          setItems(result);
          handleScriptFilterAutoExecute({
            itemArr: result,
            input,
            updatedInput
          });
        })
        .catch((error: any) => {
          throw new Error(`findCommands throws Error\n ${error}`);
        });
    };

    // Search workflow commands, builtInCommands
    if (workManager.hasEmptyWorkStk()) {
      searchCommands();
    }
    // Execute Script filter
    else if (workManager.getTopCommand().type === 'scriptfilter') {
      // Execute current command's script filter
      if (assumedCommand === workManager.getTopCommand().input) {
        workManager
          .scriptFilterExcute(updatedInput)
          .catch(handleWorkflowError);
      }
      // Clear stack and search commands
      else {
        workManager.clearCommandStack();
        searchCommands();
      }
    }

    clearIndexInfo();
  };

  const onWheelHandler = (e: any) => {
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
    setItems([]);
    clearInput();
    clearIndexInfo();
    workManager.clearCommandStack();
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
      handleNormalInput(input, updatedInput, modifiers);
    } else if (keyData.isEnter) {
      await handleReturn(modifiers);
    } else if (keyData.isArrowDown) {
      handleDownArrow();
    } else if (keyData.isArrowUp) {
      handleUpArrow();
    } else if (keyData.isEscape) {
      cleanUpBeforeHide();
    } else if (keyData.isArrowLeft || keyData.isArrowRight) {
      // Skip
    } else if (
      checkObjectsAllValue(modifiers)(false) &&
      !keyData.isSpecialCharacter
    ) {
      handleNormalInput(input, updatedInput, modifiers);
    }
  };

  const onItemShouldBeUpdate = (itemsToSet: any[]) => {
    clearIndexInfo();
    setItems(itemsToSet);
  };

  const onItemPressHandler = () => {};

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
    onWheelHandler,
    onMouseoverHandler,
    onDoubleClickHandler,
    onItemPressHandler,
    onItemShouldBeUpdate,
    getInputProps: getTargetProps
  };
};

export default useSearchWindowControl;
