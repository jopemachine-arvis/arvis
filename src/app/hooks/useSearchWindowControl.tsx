/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lonely-if */
import React, { useEffect, useRef, useState } from 'react';
import { Core } from 'arvis-core';
import { ipcRenderer, clipboard } from 'electron';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { isWithCtrlOrCmd } from '@utils/index';
import _ from 'lodash';
import useKey from '../../use-key-capture/src';

type IndexInfo = {
  selectedItemIdx: number;
  itemStartIdx: number;
};

/**
 * @description
 */
const useSearchWindowControl = ({
  items,
  setItems,
  maxItemCount,
  maxRetrieveCount,
  isPinned,
  setIsPinned,
  spinning,
}: {
  items: any[];
  setItems: (items: any[]) => void;
  maxItemCount: number;
  maxRetrieveCount: number;
  isPinned: boolean;
  setIsPinned: (bool: boolean) => void;
  spinning: boolean;
}) => {
  const actionFlowManager = Core.ActionFlowManager.getInstance();

  const { keyData, getTargetProps } = useKey();
  const { originalRef: inputRef } = getTargetProps();

  const [shouldBeHided, setShouldBeHided] = useState<boolean>(false);

  const [indexInfo, setIndexInfo] = useState<IndexInfo>({
    itemStartIdx: 0,
    selectedItemIdx: 0,
  });

  const [bestMatch, setBestMatch] = useState<string>('');

  const inputStr = inputRef.current
    ? (inputRef.current! as HTMLInputElement).value
    : '';

  const alreadyCleared = false;
  const alreadyClearedRef = useRef<boolean>(alreadyCleared);
  const hideSearchWindowByBlurCbRef = useRef<any>();

  const isPinnedRef = useRef<boolean>(isPinned);

  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

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
   * @param {string} updatedInput
   * @summary scriptfilter must be able to run automatically when a command is entered
   *          This function handle scriptfilter's auto run.
   * @description Must be called when first script filter is triggered
   */
  const handleScriptFilterAutoExecute = ({
    itemArr,
    updatedInput,
  }: {
    itemArr: any[];
    updatedInput: string;
  }) => {
    // auto script filter executing should be started from first item
    if (itemArr.length === 0) return;
    const firstItem = itemArr[0];
    if (firstItem.type !== 'scriptFilter') return;

    const hasRequiredArg =
      Core.hasRequiredArg({
        item: firstItem,
        inputStr: updatedInput,
      }) &&
      Core.isInputMeetWithspaceCond({
        item: firstItem,
        inputStr: updatedInput,
      });

    if (hasRequiredArg) {
      const commandOnStackIsEmpty = firstItem;

      actionFlowManager.setRunningScriptfilterItem({
        selectedItem: itemArr[0],
        setRunningText: true,
      });

      Core.scriptFilterExcute(updatedInput, commandOnStackIsEmpty);
    }
  };

  /**
   * @param {string} updatedInput
   */
  const handleNormalInput = async (updatedInput: string) => {
    let timer: NodeJS.Timeout;

    try {
      if (actionFlowManager.hasEmptyTriggerStk()) {
        setBestMatch(
          (Core.history.getBestMatch(updatedInput)! as Log).inputStr!
        );
      }
    } catch {
      setBestMatch('');
    }

    const handler = async () => {
      clearTimeout(timer);

      const searchCommands = async () => {
        const itemArr = await Core.findCommands(updatedInput);
        setItems(itemArr.slice(0, maxRetrieveCount));
        handleScriptFilterAutoExecute({
          itemArr,
          updatedInput,
        });
      };

      // Search workflow commands, builtInCommands
      if (actionFlowManager.hasEmptyTriggerStk()) {
        await searchCommands();
      }
      // Execute Script filter
      else if (actionFlowManager.getTopTrigger().type === 'scriptFilter') {
        const scriptfilterShouldBeReRun =
          Core.hasRequiredArg({
            item: actionFlowManager.getTopTrigger().actionTrigger,
            inputStr: updatedInput,
          }) &&
          Core.isInputMeetWithspaceCond({
            item: actionFlowManager.getTopTrigger().actionTrigger,
            inputStr: updatedInput,
          }) &&
          !Core.isArgTypeNoButHaveArg({
            item: actionFlowManager.getTopTrigger().actionTrigger,
            inputStr: updatedInput,
          });

        // Execute current command's script filter
        if (
          scriptfilterShouldBeReRun &&
          updatedInput.startsWith(actionFlowManager.getTopTrigger().input)
        ) {
          actionFlowManager.setRunningScriptfilterItem({
            selectedItem: actionFlowManager.getTopTrigger()
              .actionTrigger as Command,
            setRunningText: true,
          });

          Core.scriptFilterExcute(updatedInput);
        }

        // If the command changes, clear stack and search commands
        else {
          actionFlowManager.clearTriggerStk();
          await searchCommands();
        }
      }

      clearIndexInfo();
    };

    // Wait a little longer than child process spawning will uses (around 15ms).
    timer = setTimeout(handler, 25);
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
    // Resetinput 호출될 때 storeAvailability 동기화 문제로 빼놓음
    if (!_.isNil(str) && inputRef && inputRef.current) {
      (inputRef.current! as HTMLInputElement).value = str;
    }
    if (needItemsUpdate) {
      handleNormalInput(str ?? '');
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

    const item = actionFlowManager.hasEmptyTriggerStk()
      ? selectedItem
      : actionFlowManager.getTopTrigger().actionTrigger;

    const hasRequiredArg = item
      ? Core.hasRequiredArg({
          item,
          inputStr,
        })
      : true;

    if (selectedItem.type === 'scriptFilter') {
      const newInputStr =
        hasRequiredArg || selectedItem.withspace
          ? `${selectedItem.command} `
          : selectedItem.command;

      setInputStr({ str: newInputStr, needItemsUpdate: false });

      actionFlowManager.setRunningScriptfilterItem({
        selectedItem: items[selectedItemIdx],
        setRunningText: hasRequiredArg,
      });

      Core.scriptFilterExcute(newInputStr, items[selectedItemIdx]);
    } else {
      if (hasRequiredArg) {
        setIsPinned(false);
        actionFlowManager.handleItemPressEvent(
          selectedItem,
          inputStr,
          modifiers
        );
      } else {
        setInputStr({ str: `${selectedItem.command} `, needItemsUpdate: true });
      }
    }

    setBestMatch('');
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
  const cleanUpBeforeHide = ({
    alreadyCleanedUp,
    searchWindowIsPinned,
  }: {
    alreadyCleanedUp: boolean;
    searchWindowIsPinned: boolean;
  }) => {
    if (alreadyCleanedUp || searchWindowIsPinned) return;
    alreadyClearedRef.current = true;
    setItems([]);
    clearIndexInfo();
    actionFlowManager.clearTriggerStk();
    setShouldBeHided(true);
    setBestMatch('');
  };

  /**
   * @param {number} selectedItemIdx
   */
  const onHandleReturnByNumberKey = async (selectedItemIdx: number) => {
    if (spinning) return;
    if (selectedItemIdx === 0 || selectedItemIdx >= items.length) {
      return;
    }

    await handleReturn({
      selectedItemIdx: indexInfo.itemStartIdx + selectedItemIdx - 1,
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
      'Enter',
    ];

    // For quicklook feature, prevent adding space when quicklook shortcut is pressed
    if (e.shiftKey && e.key === ' ') {
      return;
    }

    if (!exceptionKeys.includes(e.key)) {
      const txt = (inputRef.current! as HTMLInputElement).value!
        ? (inputRef.current! as HTMLInputElement).value
        : '';

      handleNormalInput(txt);
    }

    actionFlowManager.clearModifierOnScriptFilterItem();
  };

  /**
   * @param {any} item
   */
  const autoCompleteHandler = (item: any) => {
    if (!item) return;
    if (actionFlowManager.hasEmptyTriggerStk() && item.command) {
      setInputStr({ str: item.command, needItemsUpdate: true });
    } else if (
      actionFlowManager.getTopTrigger().type === 'scriptFilter' &&
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
    if (item.quicklookurl) {
      ipcRenderer.send(IPCRendererEnum.showQuicklookWindow, {
        url: item.quicklookurl,
      });
    }
  };

  /**
   * @param {any} item
   */
  const showTextLargeTypeHandler = (item: any) => {
    if (!item) return;
    let text = '(no target)';

    if (item.text && typeof item.text === 'string') {
      text = item.text;
    } else if (item.text && item.text.largetype) {
      text = item.text.largetype;
    } else if (item.title) {
      text = item.title;
    } else if (item.command) {
      text = item.command;
    }

    ipcRenderer.send(IPCRendererEnum.showLargeTextWindow, {
      text,
    });
  };

  /**
   * @param {any} item
   */
  const itemCopyHandler = (item: any) => {
    if (!item) return;
    let text = '(no copy target)';

    if (item.text && typeof item.text === 'string') {
      text = item.text;
    } else if (item.text && item.text.copy) {
      text = item.text.copy;
    } else if (item.title) {
      text = item.title;
    } else if (item.command) {
      text = item.command;
    }

    clipboard.writeText(text);
  };

  /**
   * @summary
   */
  const bestMatchKeyAvailable = () => {
    return (
      actionFlowManager.hasEmptyTriggerStk() &&
      bestMatch !== '' &&
      (inputRef.current as any).selectionStart === inputStr.length
    );
  };

  /**
   * @summary
   */
  const onKeydownHandler = async () => {
    if (spinning) return;
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

    const searchByNextInput = () =>
      setTimeout(
        () =>
          handleNormalInput(
            (document.getElementById('searchBar') as HTMLInputElement).value
          ),
        25
      );

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
      actionFlowManager.popTrigger();
    } else if (keyData.isTab) {
      autoCompleteHandler(items[selectedItemIdx]);
    } else if (keyData.isWithShift && keyData.isSpace) {
      quicklookHandler(items[selectedItemIdx]);
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'L') {
      showTextLargeTypeHandler(items[selectedItemIdx]);
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'C') {
      itemCopyHandler(items[selectedItemIdx]);
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'V') {
      searchByNextInput();
    } else if (ctrlOrCmdKeyPressed && input && input.toUpperCase() === 'Z') {
      searchByNextInput();
    } else if (keyData.isArrowRight && bestMatchKeyAvailable()) {
      setInputStr({ str: bestMatch, needItemsUpdate: true });
    }

    // on Macos, option key not detected!! -> maybe this logic need to be migrated to iohook
    if (modifiers.alt || modifiers.cmd || modifiers.ctrl || modifiers.shift) {
      actionFlowManager.setModifierOnScriptFilterItem(
        selectedItemIdx,
        modifiers
      );
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
   * @summary Check that the window should be closed, and close the window if it should be closed
   */
  const checkShouldBeHided = (forceHide?: boolean) => {
    if (isPinned) return;

    // After cleanUp
    if (forceHide || shouldBeHided === true) {
      (document.getElementById('searchBar') as HTMLInputElement).value = '';
      // Give some time to remove Afterimage
      ipcRenderer.send(IPCRendererEnum.hideSearchWindow);
    }
  };

  /**
   * @summary
   */
  const onWorkEndHandler = () => {
    setShouldBeHided(true);
    alreadyClearedRef.current = true;
    checkShouldBeHided(true);
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
      cleanUpBeforeHide({
        alreadyCleanedUp: alreadyClearedRef.current,
        searchWindowIsPinned: isPinnedRef.current,
      });
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
    if (_.isNull(keyData.key)) return;

    onKeydownHandler();
  }, [keyData]);

  useEffect(() => {
    checkShouldBeHided();
  }, [shouldBeHided]);

  return {
    bestMatch,
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
