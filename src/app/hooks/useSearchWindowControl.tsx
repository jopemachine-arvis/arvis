/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lonely-if */
import React, { useEffect, useRef, useState } from 'react';
import { Core } from 'arvis-core';
import { ipcRenderer, clipboard } from 'electron';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { isWithCtrlOrCmd } from '@utils/index';
import useKey from '../../use-key-capture/src';

type IndexInfo = {
  selectedItemIdx: number;
  itemStartIdx: number;
};

/**
 * @param {any[]} items
 * @param {(items: any[]) => void} setItems
 * @param {number} maxItemCount
 */
const useSearchWindowControl = ({
  items,
  setItems,
  maxItemCount,
  maxRetrieveCount,
  storeAvailable,
}: {
  items: any[];
  setItems: (items: any[]) => void;
  maxItemCount: number;
  maxRetrieveCount: number;
  storeAvailable: boolean;
}) => {
  const workManager = Core.WorkManager.getInstance();

  const { keyData, getTargetProps, resetKeyData: clearInput } = useKey();
  const { originalRef: inputRef } = getTargetProps();

  const [shouldBeHided, setShouldBeHided] = useState<boolean>(false);

  const [indexInfo, setIndexInfo] = useState<IndexInfo>({
    itemStartIdx: 0,
    selectedItemIdx: 0,
  });

  const inputStr = inputRef.current
    ? (inputRef.current! as HTMLInputElement).value
    : '';

  const alreadyCleared = false;
  const alreadyClearedRef = useRef<boolean>(alreadyCleared);
  const hideSearchWindowByBlurCbRef = useRef<any>();

  /**
   * @summary
   */
  const clearIndexInfo = () => {
    setIndexInfo({
      itemStartIdx: 0,
      selectedItemIdx: 0,
    });
  };

  /**
   * @return {number} changed selectedItemIdx
   * @summary
   */
  const handleUpArrow = () => {
    let selectedItemIdx =
      (indexInfo.selectedItemIdx - 1 + items.length) % items.length;

    // Select most bottom item
    if (selectedItemIdx === items.length - 1 && items.length !== 1) {
      selectedItemIdx = items.length - 1;

      const itemStartIdx =
        items.length - maxItemCount >= 0 ? items.length - maxItemCount : 0;

      setIndexInfo({
        itemStartIdx,
        selectedItemIdx,
      });
    }
    // Select up
    else if (indexInfo.itemStartIdx > selectedItemIdx) {
      setIndexInfo({
        itemStartIdx: indexInfo.itemStartIdx - 1,
        selectedItemIdx,
      });
    } else {
      setIndexInfo({
        itemStartIdx: indexInfo.itemStartIdx,
        selectedItemIdx,
      });
    }

    return selectedItemIdx;
  };

  /**
   * @return {number} changed selectedItemIdx
   * @summary
   */
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
        selectedItemIdx,
      });
    } else {
      setIndexInfo({
        itemStartIdx: indexInfo.itemStartIdx,
        selectedItemIdx,
      });
    }

    return selectedItemIdx;
  };

  /**
   * @param {any[]} itemArr
   * @param {string} pressedKey
   * @param {string} updatedInput
   */
  const handleScriptFilterAutoExecute = ({
    itemArr,
    pressedKey,
    updatedInput,
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
      commandOnStackIsEmpty = firstItem;

      workManager.setRunningText({
        selectedItem: itemArr[0],
      });

      Core.scriptFilterExcute(updatedInput, commandOnStackIsEmpty);
    }
  };

  /**
   * @param {string} pressedKey
   * @param {string} updatedInput
   */
  const handleNormalInput = async (
    pressedKey: string,
    updatedInput: string
  ) => {
    const searchCommands = async () => {
      const itemArr = await Core.findCommands(updatedInput);
      setItems(itemArr.slice(0, maxRetrieveCount));
      handleScriptFilterAutoExecute({
        itemArr,
        pressedKey,
        updatedInput,
      });
    };

    // Search workflow commands, builtInCommands
    if (workManager.hasEmptyWorkStk()) {
      await searchCommands();
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
        await searchCommands();
      }
    }

    clearIndexInfo();
  };

  /**
   * @param  {string} str
   * @param  {needItemsUpdate} boolean
   */
  const setInputStr = ({
    str,
    needItemsUpdate,
  }: {
    str: string | undefined;
    needItemsUpdate: boolean;
  }) => {
    if (!storeAvailable) return;

    if (str && inputRef && inputRef.current) {
      (inputRef.current! as HTMLInputElement).value = str;
    }
    if (needItemsUpdate) {
      handleNormalInput('', str ?? '');
    }
  };

  /**
   * @param {number} selectedItemIdx
   * @param {any} modifiers Selected modifier keys
   */
  const handleReturn = async ({
    selectedItemIdx,
    modifiers,
  }: {
    selectedItemIdx: number;
    modifiers: any;
  }) => {
    const selectedItem = items[selectedItemIdx];
    if (!selectedItem) return;

    if (selectedItem.arg_type === 'required') {
      const [command, querys] = inputStr.split(selectedItem.command);
      if (querys.length < 2) {
        setInputStr({ str: `${selectedItem.command} `, needItemsUpdate: true });
        return;
      }
    }

    if (selectedItem.type === 'scriptfilter') {
      setInputStr({ str: selectedItem.command, needItemsUpdate: false });

      workManager.setRunningText({
        selectedItem: items[selectedItemIdx],
      });

      Core.scriptFilterExcute(selectedItem.command, items[selectedItemIdx]);
    } else {
      await workManager
        .handleItemPressEvent(selectedItem, inputStr, modifiers)
        .catch((err: any) => {
          console.error('Error occured in handleItemPressEvent!', err);
        });
    }
  };

  /**
   * @param {React.WheelEvent<HTMLInputElement>} e
   * @summary mouse wheel event handler
   */
  const onWheelHandler = (e: React.WheelEvent<HTMLInputElement>) => {
    if (e.deltaY > 0) {
      if (indexInfo.itemStartIdx + maxItemCount < items.length) {
        setIndexInfo({
          itemStartIdx: indexInfo.itemStartIdx + 1,
          selectedItemIdx: indexInfo.selectedItemIdx,
        });
      }
    } else {
      if (indexInfo.itemStartIdx > 0) {
        setIndexInfo({
          itemStartIdx: indexInfo.itemStartIdx - 1,
          selectedItemIdx: indexInfo.selectedItemIdx,
        });
      }
    }
  };

  /**
   * @param {number} index
   */
  const onMouseoverHandler = (index: number) => {
    setIndexInfo({
      itemStartIdx: indexInfo.itemStartIdx,
      selectedItemIdx: index,
    });
  };

  /**
   * @param {number} index
   */
  const onDoubleClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();

    handleReturn({
      selectedItemIdx: indexInfo.selectedItemIdx,
      modifiers: {
        cmd: e.metaKey,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
      },
    });
  };

  /**
   * @param {boolean} alreadyCleanedUp
   * @description To avoid duplicate cleanup issue, If alreadyCleanedUp is true, do nothing.
   * @summary
   */
  const cleanUpBeforeHide = (alreadyCleanedUp: boolean) => {
    if (alreadyCleanedUp) return;
    alreadyClearedRef.current = true;
    setItems([]);
    clearIndexInfo();
    workManager.clearWorkStack();
    setShouldBeHided(true);
  };

  /**
   * @param {number} selectedItemIdx
   */
  const onHandleReturnByNumberKey = async (selectedItemIdx: number) => {
    if (!storeAvailable) return;
    if (selectedItemIdx === 0 || selectedItemIdx >= items.length) {
      return;
    }

    await handleReturn({
      selectedItemIdx: selectedItemIdx - 1,
      modifiers: {
        cmd: false,
        ctrl: false,
        shift: false,
        alt: false,
      },
    });
  };

  /**
   * @param {KeyboardEvent} e
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

      handleNormalInput(e.key, txt);
    }

    workManager.clearModifierOnScriptFilterItem();
  };

  /**
   * @param {any} item
   */
  const autoCompleteHandler = (item: any) => {
    if (!item) return;
    if (workManager.hasEmptyWorkStk() && item.command) {
      setInputStr({ str: item.command, needItemsUpdate: true });
    } else if (
      workManager.getTopWork().type === 'scriptfilter' &&
      item.autocomplete
    ) {
      setInputStr({ str: item.autocomplete, needItemsUpdate: true });
    }
  };

  /**
   * @param {any} item
   */
  const quicklookHandler = (item: any) => {
    if (!item) return;
    if (
      !workManager.hasEmptyWorkStk() &&
      workManager.getTopWork().type === 'scriptfilter' &&
      item.quicklookurl
    ) {
      ipcRenderer.send(IPCRendererEnum.showQuicklookWindow, {
        url: item.quicklookurl,
      });
    }
  };

  /**
   * @param {any} item
   */
  const showTextLargeTypeHandler = (item: any) => {
    if (
      !workManager.hasEmptyWorkStk() &&
      workManager.getTopWork().type === 'scriptfilter'
    ) {
      const text =
        item.text && item.text.largetype ? item.text.largetype : item.title;
      ipcRenderer.send(IPCRendererEnum.showLargeTextWindow, {
        text,
      });
    }
  };

  /**
   * @param {any} item
   */
  const itemCopyHandler = (item: any) => {
    if (
      !workManager.hasEmptyWorkStk() &&
      workManager.getTopWork().type === 'scriptfilter'
    ) {
      clipboard.writeText(item.title);
    }
  };

  /**
   * @summary
   */
  const onKeydownHandler = async () => {
    if (!storeAvailable) return;
    const input: string | undefined | null = keyData.key;

    const modifiers = {
      // On mac, cmd key is handled by meta;
      cmd: keyData.isWithMeta,
      ctrl: keyData.isWithCtrl,
      shift: keyData.isWithShift,
      alt: keyData.isWithAlt,
    };

    let { selectedItemIdx } = indexInfo;

    const ctrlOrCmdKeyPressed = isWithCtrlOrCmd({
      isWithCmd: keyData.isWithMeta,
      isWithCtrl: keyData.isWithCtrl,
    });

    if (keyData.isNumber && (modifiers.cmd || modifiers.ctrl)) {
      await onHandleReturnByNumberKey(Number(input));
    } else if (keyData.isEnter) {
      await handleReturn({
        selectedItemIdx,
        modifiers,
      });
    } else if (keyData.isArrowDown) {
      selectedItemIdx = handleDownArrow();
    } else if (keyData.isArrowUp) {
      selectedItemIdx = handleUpArrow();
    } else if (keyData.isEscape) {
      workManager.popWork();
      alreadyClearedRef.current = true;
    } else if (keyData.isTab) {
      autoCompleteHandler(items[selectedItemIdx]);
    } else if (keyData.isShift && !keyData.key) {
      quicklookHandler(items[selectedItemIdx]);
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'L') {
      showTextLargeTypeHandler(items[selectedItemIdx]);
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'C') {
      itemCopyHandler(items[selectedItemIdx]);
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'V') {
      // To update items, trigger normal event
      handleNormalInput('', clipboard.readText());
    } else if (keyData.isArrowLeft || keyData.isArrowRight) {
      // Skip
    }

    if (modifiers.alt || modifiers.cmd || modifiers.ctrl || modifiers.shift) {
      workManager.setModifierOnScriptFilterItem(selectedItemIdx, modifiers);
    }
  };

  /**
   * @param {any[]} itemsToSet
   */
  const onItemShouldBeUpdate = ({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    items,
    needIndexInfoClear,
  }: {
    items: any[];
    needIndexInfoClear: boolean;
  }) => {
    setItems(items.slice(0, maxRetrieveCount));
    if (needIndexInfoClear) {
      clearIndexInfo();
    }
  };

  /**
   * @summary
   */
  const onItemPressHandler = () => {
    clearIndexInfo();
  };

  /**
   * @summary
   */
  const onWorkEndHandler = () => {
    setShouldBeHided(true);
  };

  /**
   * @param {string} str
   * @param {boolean} needItemsUpdate
   */
  const onInputShouldBeUpdate = ({
    str,
    needItemsUpdate,
  }: {
    str: string;
    needItemsUpdate: boolean;
  }) => {
    setInputStr({ str, needItemsUpdate });
  };

  useEffect(() => {
    hideSearchWindowByBlurCbRef.current = () => {
      cleanUpBeforeHide(alreadyClearedRef.current);
    };

    if (inputRef.current) {
      (inputRef.current! as HTMLInputElement).onkeyup = onKeyupHandler;
    }

    ipcRenderer.on(IPCMainEnum.searchWindowShowCallback, () => {
      alreadyClearedRef.current = false;
      setShouldBeHided(false);
    });

    ipcRenderer.on(IPCMainEnum.hideSearchWindowByBlurEvent, () => {
      hideSearchWindowByBlurCbRef.current();
    });
  }, []);

  useEffect(() => {
    // Ignore Initial Mount
    if (keyData.key === null) return;

    onKeydownHandler();
  }, [keyData]);

  useEffect(() => {
    // After cleanUp
    if (shouldBeHided === true && items.length === 0) {
      (document.getElementById('searchBar') as HTMLInputElement).value = '';

      // Give some time to remove Afterimage
      setTimeout(() => {
        ipcRenderer.send(IPCRendererEnum.hideSearchWindow);
      }, 10);
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
    getInputProps: getTargetProps,
  };
};

export default useSearchWindowControl;
