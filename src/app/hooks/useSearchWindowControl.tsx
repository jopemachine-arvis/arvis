import React, { useEffect, useRef, useState } from 'react';
import { Core } from 'arvis-core';
import { ipcRenderer, clipboard } from 'electron';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { isWithCtrlOrCmd, isSupportedImageFormat } from '@utils/index';
import _ from 'lodash';
import PCancelable from 'p-cancelable';
import path from 'path';
import isUrl from 'is-url';
import { isText } from 'istextorbinary';
import useKey from '../../external/use-key-capture/src';
import usePressedModifier from './usePressedModifier';

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
  quicklookData,
  setQuicklookData,
  hoveringOnQuicklook,
  spinning,
}: {
  items: (Command | ScriptFilterItem | PluginItem)[];
  setItems: (items: (Command | ScriptFilterItem | PluginItem)[]) => void;
  maxItemCount: number;
  maxRetrieveCount: number;
  isPinned: boolean;
  setIsPinned: (bool: boolean) => void;
  quicklookData: any;
  setQuicklookData: (data: any) => void;
  hoveringOnQuicklook: boolean;
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

  const [autoSuggestion, setAutoSuggestion] = useState<string>('');

  const inputStr = inputRef.current
    ? (inputRef.current! as HTMLInputElement).value
    : '';

  const alreadyCleared = false;
  const alreadyClearedRef = useRef<boolean>(alreadyCleared);
  const hideSearchWindowByBlurCbRef = useRef<any>();

  const isPinnedRef = useRef<boolean>(isPinned);

  const pressingModifiers = usePressedModifier();

  const [hasDeferedPlugins, setHasDeferedPlugins] = useState<boolean>(false);

  const {
    alt: pressingAlt,
    ctrl: pressingCtrl,
    meta: pressingMeta,
    shift: pressingShift,
  } = pressingModifiers;

  let unresolvedPluginPromises: PCancelable<PluginExectionResult>[] = [];

  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

  /**
   */
  const clearIndexInfo = () => {
    setIndexInfo({
      itemStartIdx: 0,
      selectedItemIdx: 0,
    });
  };

  /**
   * @returns changed selectedItemIdx
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
   * @returns changed selectedItemIdx
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
   * scriptfilter must be able to run automatically when a command is entered
   * This function handle scriptfilter's auto run.
   * Must be called when first script filter is triggered
   * @param itemArr
   * @param updatedInput
   */
  const handleScriptFilterAutoExecute = ({
    itemArr,
    updatedInput,
  }: {
    itemArr: (Command | ScriptFilterItem | PluginItem)[];
    updatedInput: string;
  }): boolean => {
    // auto script filter executing should be started from first item
    if (itemArr.length === 0) return false;
    const firstItem = itemArr[0] as Command;
    if (firstItem.type !== 'scriptFilter') return false;

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
        selectedItem: itemArr[0] as Command,
        setRunningText: true,
      });

      Core.scriptFilterExcute(updatedInput, commandOnStackIsEmpty);
      return true;
    }

    return false;
  };

  const cancelUnresolvedPluginPromises = (): void => {
    unresolvedPluginPromises.forEach(
      (item: PCancelable<PluginExectionResult>) => {
        if (!item.isCanceled) {
          item.cancel();
        }
      }
    );
  };

  const handleDeferedPluginItems = (
    normalItemArr: (Command | PluginItem)[],
    unresolvedPluginItems: PCancelable<PluginExectionResult>[]
  ) => {
    if (unresolvedPluginItems.length <= 0) return;

    setHasDeferedPlugins(true);
    cancelUnresolvedPluginPromises();
    unresolvedPluginPromises = unresolvedPluginItems;

    let delayedResolved: PluginItem[] = [];
    let progress = 0;

    // To do:: To avoid flickering, renewal would be made only after all the primises are resolved.
    // If there is some method to avoid window flickering, change below logic to renew one by one.
    unresolvedPluginItems.forEach(
      (notResolvedItemPromise: PCancelable<PluginExectionResult>) => {
        notResolvedItemPromise
          .then((updatedItems: PluginExectionResult) => {
            Core.pluginWorkspace.appendPluginItemAttr(inputStr, [updatedItems]);

            delayedResolved = [...delayedResolved, ...updatedItems.items];
            return null;
          })
          .catch((err) => {
            if (err.name !== 'CancelError') console.error(err);
          })
          .finally(() => {
            progress += 1;

            if (progress >= unresolvedPluginItems.length) {
              setItems(
                [...normalItemArr, ...delayedResolved].slice(
                  0,
                  maxRetrieveCount
                )
              );

              unresolvedPluginPromises = [];
              setHasDeferedPlugins(false);
            }
          });
      }
    );
  };

  /**
   * @param updatedInput
   */
  const handleNormalInput = async (updatedInput: string) => {
    let timer: NodeJS.Timeout;

    try {
      if (actionFlowManager.hasEmptyTriggerStk()) {
        setAutoSuggestion(
          (Core.history.getLatestMatch(updatedInput)! as Log).inputStr!
        );
      }
    } catch {
      setAutoSuggestion('');
    }

    cancelUnresolvedPluginPromises();

    const handler = async () => {
      clearTimeout(timer);

      const searchCommands = async () => {
        const { items: itemArr, deferedItems } = await Core.findCommands(
          updatedInput
        );

        setItems(itemArr.slice(0, maxRetrieveCount));

        const scriptfilterExecuted = handleScriptFilterAutoExecute({
          itemArr,
          updatedInput,
        });

        if (!scriptfilterExecuted) {
          handleDeferedPluginItems(itemArr, deferedItems);
        }
      };

      // Search workflow commands, builtInCommands
      if (actionFlowManager.hasEmptyTriggerStk()) {
        await searchCommands();
      }
      // Execute Script filter
      else if (actionFlowManager.getTopTrigger().type === 'scriptFilter') {
        const scriptfilterShouldBeReRun =
          Core.hasRequiredArg({
            item: actionFlowManager.getTopTrigger().actionTrigger as Command,
            inputStr: updatedInput,
          }) &&
          Core.isInputMeetWithspaceCond({
            item: actionFlowManager.getTopTrigger().actionTrigger as Command,
            inputStr: updatedInput,
          }) &&
          !Core.isArgTypeNoButHaveArg({
            item: actionFlowManager.getTopTrigger().actionTrigger as Command,
            inputStr: updatedInput,
          });

        // Execute current command's script filter
        if (
          scriptfilterShouldBeReRun &&
          updatedInput.startsWith(actionFlowManager.getTopTrigger().input)
        ) {
          // actionFlowManager.setRunningScriptfilterItem({
          //   selectedItem: actionFlowManager.getTopTrigger()
          //     .actionTrigger as Command,
          //   setRunningText: true,
          // });

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
   * @param str
   * @param needItemsUpdate
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
   * @param selectedItemIdx
   * @param modifiers
   */
  const handleReturn = async ({
    selectedItemIdx,
    modifiers,
  }: {
    selectedItemIdx: number;
    modifiers: any;
  }) => {
    const selectedItem = items[selectedItemIdx];
    if (!selectedItem || spinning || Core.pluginWorkspace.executingAsyncPlugins)
      return;

    const item = actionFlowManager.hasEmptyTriggerStk()
      ? selectedItem
      : actionFlowManager.getTopTrigger().actionTrigger;

    const hasRequiredArg = item
      ? Core.hasRequiredArg({
          item: item as Command,
          inputStr,
        })
      : true;

    if ((selectedItem as Command).type === 'scriptFilter') {
      const newInputStr =
        hasRequiredArg || (selectedItem as Command).withspace
          ? `${(selectedItem as Command).command} `
          : (selectedItem as Command).command;

      setInputStr({ str: newInputStr, needItemsUpdate: false });

      actionFlowManager.setRunningScriptfilterItem({
        selectedItem: items[selectedItemIdx] as Command,
        setRunningText: hasRequiredArg,
      });

      Core.scriptFilterExcute(newInputStr!, items[selectedItemIdx] as Command);
    } else {
      if (hasRequiredArg) {
        setIsPinned(false);
        actionFlowManager.handleItemPressEvent(
          selectedItem,
          inputStr,
          modifiers
        );
      } else {
        setInputStr({
          str: `${(selectedItem as Command).command} `,
          needItemsUpdate: true,
        });
      }
    }

    setAutoSuggestion('');
  };

  /**
   * Mouse wheel event handler
   * @param e
   */
  const onWheelHandler = (e: React.WheelEvent<HTMLInputElement>) => {
    if (hoveringOnQuicklook) return;

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
   * @param index
   */
  const onMouseoverHandler = (index: number) => {
    setIndexInfo({
      itemStartIdx: indexInfo.itemStartIdx,
      selectedItemIdx: index,
    });
  };

  /**
   * @param e
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
   * To avoid duplicate cleanup issue, If alreadyCleanedUp is true, do nothing.
   * @param alreadyCleanedUp
   * @param searchWindowIsPinned
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
    setAutoSuggestion('');
  };

  /**
   * @param selectedItemIdx
   */
  const onHandleReturnByNumberKey = async (selectedItemIdx: number) => {
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
   * @param item
   */
  const autoCompleteHandler = (
    item: Command | ScriptFilterItem | PluginItem
  ) => {
    if (!item) return;
    if (actionFlowManager.hasEmptyTriggerStk() && (item as Command).command) {
      setInputStr({ str: (item as Command).command, needItemsUpdate: true });
    } else if (
      actionFlowManager.getTopTrigger().type === 'scriptFilter' &&
      (item as ScriptFilterItem).autocomplete
    ) {
      setInputStr({
        str: (item as ScriptFilterItem).autocomplete,
        needItemsUpdate: true,
      });
    }
  };

  /**
   * @param item
   */
  const quicklookHandler = (item: Command | ScriptFilterItem | PluginItem) => {
    if (!item) return;

    setQuicklookData({
      ...quicklookData,
      active: !quicklookData.active,
    });
  };

  /**
   * @param item
   */
  const showTextLargeTypeHandler = (
    item: Command | ScriptFilterItem | PluginItem
  ) => {
    if (!item) return;
    let text = '(no target)';

    if (
      (item as ScriptFilterItem).text &&
      typeof (item as ScriptFilterItem).text === 'string'
    ) {
      text = (item as ScriptFilterItem).text as string;
    } else if (
      (item as ScriptFilterItem).text &&
      (item as ScriptFilterItem).text!.largetype
    ) {
      text = (item as ScriptFilterItem).text!.largetype as string;
    } else if (item.title) {
      text = item.title;
    } else if ((item as Command).command) {
      text = (item as Command).command!;
    }

    ipcRenderer.send(IPCRendererEnum.showLargeTextWindow, {
      text,
    });
  };

  /**
   * @param item
   */
  const itemCopyHandler = (item: Command | ScriptFilterItem | PluginItem) => {
    if (!item) return;
    let text = '(no copy target)';

    if (
      (item as ScriptFilterItem).text &&
      typeof (item as ScriptFilterItem).text === 'string'
    ) {
      text = (item as ScriptFilterItem).text as string;
    } else if (
      (item as ScriptFilterItem).text &&
      (item as ScriptFilterItem).text!.copy
    ) {
      text = (item as ScriptFilterItem).text!.copy!;
    } else if (item.title) {
      text = item.title;
    } else if ((item as Command).command) {
      text = (item as Command).command!;
    }

    clipboard.writeText(text);
  };

  /**
   */
  const autoSuggestionIsAvailable = () => {
    return (
      actionFlowManager.hasEmptyTriggerStk() &&
      autoSuggestion !== '' &&
      (inputRef.current as any).selectionStart === inputStr.length
    );
  };

  /**
   */
  const onKeydownHandler = async () => {
    if (spinning) return;
    const input: string | undefined | null = keyData.key;

    const modifiers = {
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
    } else if (keyData.isArrowRight && autoSuggestionIsAvailable()) {
      setInputStr({ str: autoSuggestion, needItemsUpdate: true });
    }
  };

  /**
   * @param items
   * @param needIndexInfoClear
   */
  const onItemShouldBeUpdate = ({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    items,
    needIndexInfoClear,
  }: {
    items: (Command | ScriptFilterItem | PluginItem)[];
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
   * Check that the window should be closed, and close the window if it should be closed
   */
  const checkShouldBeHided = (forceHide?: boolean) => {
    if (isPinned) return;

    if (forceHide || shouldBeHided === true) {
      setQuicklookData({
        type: undefined,
        data: undefined,
        active: false,
      });
      cancelUnresolvedPluginPromises();
      (document.getElementById('searchBar') as HTMLInputElement).value = '';
      ipcRenderer.send(IPCRendererEnum.hideSearchWindow);
    }
  };

  /**
   */
  const onWorkEndHandler = () => {
    setShouldBeHided(true);
    alreadyClearedRef.current = true;
    checkShouldBeHided(true);
  };

  /**
   * @param str
   * @param needItemsUpdate
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

  const inferQuicklookData = (item: any) => {
    if (item.quicklook) {
      return item.quicklook;
    }

    if (item.quicklookurl) {
      return {
        type: 'html',
        data: item.quicklookurl,
      };
    }

    if (item.arg) {
      if (path.isAbsolute(item.arg)) {
        if (isSupportedImageFormat(path.extname(item.arg))) {
          return {
            type: 'image',
            data: item.arg,
          };
        }

        if (path.extname(item.arg) === '.pdf') {
          return {
            type: 'pdf',
            data: item.arg,
          };
        }

        if (isText(item.arg)) {
          return {
            type: 'text',
            data: item.arg,
          };
        }
      }

      if (isUrl(item.arg)) {
        return {
          type: 'html',
          data: item.arg,
        };
      }
    }

    return {
      type: undefined,
      data: undefined,
    };
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
  }, []);

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.searchWindowShowCallback, () => {
      alreadyClearedRef.current = false;
      setShouldBeHided(false);
    });

    ipcRenderer.on(IPCMainEnum.hideSearchWindowByBlurEvent, () => {
      hideSearchWindowByBlurCbRef.current();
    });
  }, []);

  useEffect(() => {
    const target = items[indexInfo.selectedItemIdx];

    if (target) {
      setQuicklookData({
        active: quicklookData.active,
        ...inferQuicklookData(target),
      });
    }
  }, [items, indexInfo]);

  useEffect(() => {
    // Ignore Initial Mount
    if (_.isNull(keyData.key)) return;

    onKeydownHandler();
  }, [keyData]);

  useEffect(() => {
    const modifiers = {
      cmd: pressingMeta,
      ctrl: pressingCtrl,
      shift: pressingShift,
      alt: pressingAlt,
    };

    if (modifiers.alt || modifiers.cmd || modifiers.ctrl || modifiers.shift) {
      actionFlowManager.setModifierOnScriptFilterItem(
        indexInfo.selectedItemIdx,
        modifiers
      );
    }
  }, [
    pressingModifiers.alt,
    pressingModifiers.ctrl,
    pressingModifiers.meta,
    pressingModifiers.shift,
  ]);

  useEffect(() => {
    checkShouldBeHided();
  }, [shouldBeHided]);

  return {
    autoSuggestion,
    getInputProps: getTargetProps,
    hasDeferedPlugins,
    indexInfo,
    onDoubleClickHandler,
    onInputShouldBeUpdate,
    onItemPressHandler,
    onItemShouldBeUpdate,
    onMouseoverHandler,
    onWheelHandler,
    onWorkEndHandler,
    setInputStr,
  };
};

export default useSearchWindowControl;
