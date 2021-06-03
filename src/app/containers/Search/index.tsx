/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useState } from 'react';
import { Core } from '@jopemachine/arvis-core';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import {
  SearchBar,
  SearchResultView,
  SearchWindowScrollbar,
} from '@components/index';
import { useSearchWindowControl, useIoHook } from '@hooks/index';
import { StateType } from '@redux/reducers/types';
import { applyAlphaColor, makeActionCreator } from '@utils/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { StoreAvailabilityContext } from '@helper/storeAvailabilityContext';
import { OuterContainer } from './components';

export default function SearchWindow() {
  const {
    icon_right_margin,
    item_background_color,
    item_font_color,
    item_height,
    item_left_padding,
    item_title_subtitle_margin,
    searchbar_font_color,
    searchbar_font_size,
    searchbar_height,
    search_window_border_radius,
    search_window_footer_height,
    search_window_scrollbar_color,
    search_window_scrollbar_width,
    search_window_transparency,
    search_window_width,
    selected_item_background_color,
    selected_item_font_color,
    subtitle_font_size,
    title_font_size,
  } = useSelector((state: StateType) => state.ui_config);

  const {
    global_font,
    max_item_count_to_search,
    max_item_count_to_show,
    toggle_search_window_hotkey,
  } = useSelector((state: StateType) => state.global_config);

  const debuggingConfig = useSelector(
    (state: StateType) => state.advanced_config
  );

  const [storeAvailable, setStoreAvailable] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const [items, setItems] = useState<any[]>([]);

  const workManager = Core.WorkManager.getInstance();

  const setDebuggingOptions = () => {
    workManager.printActionType = debuggingConfig.debugging_action_type;
    workManager.printArgs = debuggingConfig.debugging_args;
    workManager.printPluginItems = debuggingConfig.debugging_plugin;
    workManager.printScriptfilter = debuggingConfig.debugging_scriptfilter;
    workManager.printWorkflowOutput = debuggingConfig.debugging_workflow_output;
    workManager.printWorkStack = debuggingConfig.debugging_workstack;
  };

  useEffect(() => {
    setDebuggingOptions();
  }, [debuggingConfig]);

  const dispatch = useDispatch();

  useIoHook();

  const {
    getInputProps,
    indexInfo,
    onDoubleClickHandler,
    onInputShouldBeUpdate,
    onItemPressHandler,
    onItemShouldBeUpdate,
    onMouseoverHandler,
    onWheelHandler,
    onWorkEndHandler,
    setInputStr,
  } = useSearchWindowControl({
    items,
    setItems,
    maxItemCount: max_item_count_to_show,
    maxRetrieveCount: max_item_count_to_search,
    isPinned,
    storeAvailable,
  });

  const registerWindowUpdater = useCallback(() => {
    Core.setStoreAvailabiltyChecker(setStoreAvailable);

    workManager.onInputShouldBeUpdate = onInputShouldBeUpdate;
    workManager.onItemPressHandler = onItemPressHandler;
    workManager.onItemShouldBeUpdate = onItemShouldBeUpdate;
    workManager.onWorkEndHandler = onWorkEndHandler;
  }, []);

  const initializeCustomActions = () => {
    Core.registerCustomAction('notification', (action: any) => {
      if (workManager.printActionType) {
        console.log('[Action: notification] ', action);
      }

      ipcRenderer.send(IPCRendererEnum.showNotification, {
        title: action.title,
        body: action.text,
      });
    });
  };

  const registerAllGlobalHotkey = () => {
    const hotkeys = Core.findHotkeys();

    ipcRenderer.send(IPCRendererEnum.setGlobalShortcut, {
      callbackTable: {
        [toggle_search_window_hotkey]: 'toggleSearchWindow',
      },
      workflowHotkeyTbl: JSON.stringify(hotkeys),
    });
  };

  const renewHotkeys = () => {
    ipcRenderer.send(IPCRendererEnum.unregisterAllShortcuts);
    registerAllGlobalHotkey();
  };

  /**
   * @summary Used to receive dispatched action from different window
   */
  const ipcCallbackTbl = {
    fetchAction: (
      e: IpcRendererEvent,
      { actionType, args }: { actionType: string; args: any }
    ) => {
      dispatch(makeActionCreator(actionType, 'arg')(args));
    },

    setSearchbarInput: (e: IpcRendererEvent, { str }: { str: string }) => {
      setInputStr({ str, needItemsUpdate: true });
    },

    renewWorkflow: (
      e: IpcRendererEvent,
      { bundleId }: { bundleId: string }
    ) => {
      Core.renewWorkflows(bundleId)
        .then(() => {
          renewHotkeys();
          return null;
        })
        .catch(console.error);
    },

    renewPlugin: (e: IpcRendererEvent, { bundleId }: { bundleId: string }) => {
      Core.renewPlugins({ initializePluginWorkspace: true, bundleId }).catch(
        console.error
      );
    },

    executeAction: (
      e: IpcRendererEvent,
      { bundleId, action }: { bundleId: string; action: any }
    ) => {
      workManager.commandExcute(
        {
          action,
          bundleId,
          type: 'hotkey',
          title: '',
        },
        '',
        {}
      );
    },

    registerAllShortcuts: (e: IpcRendererEvent) => {
      registerAllGlobalHotkey();
    },

    pinSearchWindow: (e: IpcRendererEvent, { bool }: { bool: boolean }) => {
      setIsPinned(bool);
    },
  };

  const initilizeSearchWindowIPCHandler = useCallback(() => {
    ipcRenderer.on(IPCMainEnum.executeAction, ipcCallbackTbl.executeAction);
    ipcRenderer.on(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    ipcRenderer.on(IPCMainEnum.renewPlugin, ipcCallbackTbl.renewPlugin);
    ipcRenderer.on(IPCMainEnum.renewWorkflow, ipcCallbackTbl.renewWorkflow);
    ipcRenderer.on(IPCMainEnum.pinSearchWindow, ipcCallbackTbl.pinSearchWindow);
    ipcRenderer.on(
      IPCMainEnum.registerAllShortcuts,
      ipcCallbackTbl.registerAllShortcuts
    );
    ipcRenderer.on(
      IPCMainEnum.setSearchbarInput,
      ipcCallbackTbl.setSearchbarInput
    );
  }, []);

  const unsubscribe = useCallback(() => {
    ipcRenderer.off(IPCMainEnum.executeAction, ipcCallbackTbl.executeAction);
    ipcRenderer.off(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    ipcRenderer.off(IPCMainEnum.renewPlugin, ipcCallbackTbl.renewPlugin);
    ipcRenderer.off(IPCMainEnum.renewWorkflow, ipcCallbackTbl.renewWorkflow);
    ipcRenderer.off(
      IPCMainEnum.pinSearchWindow,
      ipcCallbackTbl.pinSearchWindow
    );
    ipcRenderer.off(
      IPCMainEnum.registerAllShortcuts,
      ipcCallbackTbl.registerAllShortcuts
    );
    ipcRenderer.off(
      IPCMainEnum.setSearchbarInput,
      ipcCallbackTbl.setSearchbarInput
    );
  }, []);

  const loadWorkflowsInfo = useCallback(() => {
    Core.renewWorkflows()
      .then(() => {
        registerAllGlobalHotkey();
        return null;
      })
      .catch(console.error);
  }, []);

  const loadPluginsInfo = useCallback(() => {
    Core.renewPlugins({ initializePluginWorkspace: true }).catch(console.error);
  }, []);

  useEffect(() => {
    initializeCustomActions();
    initilizeSearchWindowIPCHandler();
    loadPluginsInfo();
    loadWorkflowsInfo();
    registerWindowUpdater();
    return unsubscribe;
  }, []);

  useEffect(() => {
    ipcRenderer.send(IPCRendererEnum.setSearchWindowWidth, {
      width: search_window_width,
    });
  }, [search_window_width]);

  useEffect(() => {
    if (!storeAvailable) return;
    if (toggle_search_window_hotkey && toggle_search_window_hotkey !== '') {
      renewHotkeys();
    }
  }, [toggle_search_window_hotkey]);

  return (
    <OuterContainer
      style={{
        borderRadius: search_window_border_radius,
        fontFamily: global_font,
        background: 'transparent',
        backgroundColor: applyAlphaColor(
          item_background_color,
          search_window_transparency
        ),
      }}
      onWheel={onWheelHandler}
      // to do:: handle below event properly
      onTouchMove={() => {}}
    >
      <StoreAvailabilityContext.Provider
        value={[storeAvailable, setStoreAvailable]}
      >
        <SearchBar
          alwaysFocus
          isPinned={isPinned}
          getInputProps={getInputProps}
          itemLeftPadding={item_left_padding}
          searchbarFontColor={searchbar_font_color}
          searchbarFontSize={searchbar_font_size}
          searchbarHeight={searchbar_height}
          spinning={!storeAvailable}
        />
        <SearchResultView
          demo={false}
          footerHeight={search_window_footer_height}
          iconRightMargin={icon_right_margin}
          itemBackgroundColor={item_background_color}
          itemFontColor={item_font_color}
          itemHeight={item_height}
          itemLeftPadding={item_left_padding}
          itemTitleSubtitleMargin={item_title_subtitle_margin}
          maxItemCount={max_item_count_to_show}
          onDoubleClickHandler={onDoubleClickHandler}
          onMouseoverHandler={onMouseoverHandler}
          searchbarHeight={searchbar_height}
          searchResult={items}
          searchWindowTransparency={search_window_transparency}
          searchWindowWidth={search_window_width}
          selectedItemBackgroundColor={selected_item_background_color}
          selectedItemFontColor={selected_item_font_color}
          selectedItemIdx={indexInfo.selectedItemIdx}
          startIdx={indexInfo.itemStartIdx}
          subtitleFontSize={subtitle_font_size}
          titleFontSize={title_font_size}
        />
        <SearchWindowScrollbar
          footerHeight={search_window_footer_height}
          itemHeight={item_height}
          itemLength={items.length}
          maxShow={max_item_count_to_show}
          scrollbarColor={search_window_scrollbar_color}
          scrollbarWidth={search_window_scrollbar_width}
          searchbarHeight={searchbar_height}
          startItemIdx={indexInfo.itemStartIdx}
        />
      </StoreAvailabilityContext.Provider>
    </OuterContainer>
  );
}
