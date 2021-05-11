/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable promise/always-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { Core } from 'arvis-core';
import { ipcRenderer } from 'electron';
import useKey from '../../use-key-capture/src';
import { IPCMainEnum, IPCRendererEnum } from '../ipc/ipcEventEnum';

type IndexInfo = {
  selectedItemIdx: number;
  itemStartIdx: number;
};

/**
 * @param  {any[]} items
 * @param  {Function} setItems
 * @param  {number} maxItemCount
 */
const useSearchWindowControl = ({
  items,
  setItems,
  maxItemCount
}: {
  items: any[];
  setItems: Function;
  maxItemCount: number;
}) => {
  const workManager = Core.WorkManager.getInstance();

  const { keyData, getTargetProps, resetKeyData: clearInput } = useKey();
  const { originalRef: inputRef } = getTargetProps();

  const [shouldBeHided, setShouldBeHided] = useState<boolean>(false);

  const [indexInfo, setIndexInfo] = useState<IndexInfo>({
    itemStartIdx: 0,
    selectedItemIdx: 0
  });

  const inputStr = inputRef.current
    ? (inputRef.current! as HTMLInputElement).value
    : '';

  const clearIndexInfo = () => {
    setIndexInfo({
      itemStartIdx: 0,
      selectedItemIdx: 0
    });
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
    pressedKey,
    updatedInput
  }: {
    itemArr: any[];
    pressedKey: string;
    updatedInput: string;
  }) => {
    // auto script filter executing should be started from first item
    if (itemArr.length === 0) return;
    const firstItem = itemArr[0];
    if (firstItem.type !== 'scriptfilter') return;

    let commandOnStackIsEmpty;

    // Assume withspace's default value is true
    // When script filter is not running (and should be running)
    const execScriptFilterWithSpace =
      firstItem.withspace === true &&
      updatedInput.includes(firstItem.command) &&
      pressedKey !== ' ';

    const execScriptFilterWithoutSpace =
      firstItem.withspace === false && updatedInput.includes(firstItem.command);

    if (execScriptFilterWithSpace || execScriptFilterWithoutSpace) {
      // eslint-disable-next-line prefer-destructuring
      commandOnStackIsEmpty = firstItem;

      const { running_subtext: runningSubText } = firstItem;
      workManager.setRunningText({
        itemArr,
        index: 0,
        runningSubText
      });

      Core.scriptFilterExcute(updatedInput, commandOnStackIsEmpty);
    }
  };

  const handleNormalInput = (pressedKey: string, updatedInput: string) => {
    const searchCommands = () => {
      const itemArr = Core.findCommands(updatedInput);
      setItems(itemArr);
      handleScriptFilterAutoExecute({
        itemArr,
        pressedKey,
        updatedInput
      });
    };

    // Search workflow commands, builtInCommands
    if (workManager.hasEmptyWorkStk()) {
      searchCommands();
    }
    // Execute Script filter
    else if (workManager.getTopWork().type === 'scriptfilter') {
      // Execute current command's script filter
      if (updatedInput.startsWith(workManager.getTopWork().input)) {
        Core.scriptFilterExcute(updatedInput);
      }
      // If the command changes, clear stack and search commands
      else {
        workManager.clearWorkStack();
        searchCommands();
      }
    }

    clearIndexInfo();
  };

  const setInputStr = ({
    str,
    needItemsUpdate
  }: {
    str: string;
    needItemsUpdate: boolean;
  }) => {
    if (inputRef && inputRef.current) {
      (inputRef.current! as HTMLInputElement).value = str;
    }
    if (needItemsUpdate) {
      handleNormalInput('', str);
    }
  };

  const handleReturn = async ({
    selectedItemIdx,
    modifiers
  }: {
    selectedItemIdx: number;
    modifiers: any;
  }) => {
    const selectedItem = items[selectedItemIdx];
    if (selectedItem.type === 'scriptfilter') {
      setInputStr({ str: selectedItem.command, needItemsUpdate: false });
      const { running_subtext: runningSubText } = items[selectedItemIdx];

      workManager.setRunningText({
        itemArr: items,
        index: selectedItemIdx,
        runningSubText
      });

      Core.scriptFilterExcute(selectedItem.command, items[selectedItemIdx]);
    } else {
      await workManager
        .commandExcute(selectedItem, inputStr, modifiers)
        .catch((err: any) => {
          console.error('Error occured in commandExecute!', err);
        });
    }
  };

  const onWheelHandler = (e: React.WheelEvent<HTMLInputElement>) => {
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
      selectedItemIdx: indexInfo.selectedItemIdx,
      modifiers: {
        cmd: keyData.isWithMeta,
        ctrl: keyData.isWithCtrl,
        shift: keyData.isWithShift,
        alt: keyData.isWithAlt
      }
    });
  };

  const cleanUpBeforeHide = () => {
    setItems([]);
    clearInput();
    clearIndexInfo();
    workManager.clearWorkStack();
    setShouldBeHided(true);
  };

  const onHandleReturnByNumberKey = async (selectedItemIdx: number) => {
    if (selectedItemIdx === 0 || selectedItemIdx >= items.length) {
      return;
    }

    await handleReturn({
      selectedItemIdx: selectedItemIdx - 1,
      modifiers: {
        cmd: false,
        ctrl: false,
        shift: false,
        alt: false
      }
    });
  };

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
      'Escape'
    ];

    if (!exceptionKeys.includes(e.key)) {
      handleNormalInput(e.key, (inputRef.current! as HTMLInputElement).value);
    }
  };

  const onKeydownHandler = async () => {
    const input = keyData.key;

    const modifiers = {
      // On mac, cmd key is handled by meta;
      cmd: keyData.isWithMeta,
      ctrl: keyData.isWithCtrl,
      shift: keyData.isWithShift,
      alt: keyData.isWithAlt
    };

    if (keyData.isNumber && (modifiers.cmd || modifiers.ctrl)) {
      await onHandleReturnByNumberKey(Number(input));
    } else if (keyData.isEnter) {
      await handleReturn({
        selectedItemIdx: indexInfo.selectedItemIdx,
        modifiers
      });
    } else if (keyData.isArrowDown) {
      handleDownArrow();
    } else if (keyData.isArrowUp) {
      handleUpArrow();
    } else if (keyData.isEscape) {
      workManager.popWork();
    } else if (keyData.isArrowLeft || keyData.isArrowRight) {
      // Skip
    }
  };

  const onItemShouldBeUpdate = (itemsToSet: any[]) => {
    setItems(itemsToSet);
    clearIndexInfo();
  };

  const onItemPressHandler = () => {
    clearIndexInfo();
  };

  const onWorkEndHandler = () => {
    setShouldBeHided(true);
  };

  const onInputShouldBeUpdate = ({
    str,
    needItemsUpdate
  }: {
    str: string;
    needItemsUpdate: boolean;
  }) => {
    setInputStr({ str, needItemsUpdate });
  };

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.hideSearchWindowByBlurEvent, () => {
      cleanUpBeforeHide();
    });

    if (inputRef.current) {
      (inputRef.current! as HTMLInputElement).onkeyup = onKeyupHandler;
    }
  }, []);

  useEffect(() => {
    // Ignore Initial Mount
    if (keyData.key === null) return;

    onKeydownHandler();
  }, [keyData]);

  useEffect(() => {
    // After cleanUp
    if (shouldBeHided === true && items.length === 0) {
      // Give some time to remove Afterimage
      setTimeout(() => {
        ipcRenderer.send(IPCRendererEnum.hideSearchWindow);
      }, 10);
      setShouldBeHided(false);
    }
  }, [shouldBeHided, items]);

  return {
    setInputStr,
    indexInfo,
    onWheelHandler,
    onMouseoverHandler,
    onDoubleClickHandler,
    onItemPressHandler,
    onItemShouldBeUpdate,
    onWorkEndHandler,
    onInputShouldBeUpdate,
    getInputProps: getTargetProps
  };
};

export default useSearchWindowControl;
