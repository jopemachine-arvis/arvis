/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Core } from 'arvis-core';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import {
  SearchBar,
  SearchResultView,
  SearchWindowScrollbar,
  Quicklook,
} from '@components/index';
import { useSearchWindowControl, useIoHook } from '@hooks/index';
import { StateType } from '@redux/reducers/types';
import { applyAlphaColor, makeActionCreator } from '@utils/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SpinnerContext } from '@helper/spinnerContext';
import {
  clipboardActionHandler,
  notificationActionHandler,
} from '@helper/customActionHandler';
import { OuterContainer } from './components';

export default function SearchWindow() {
  const {
    icon_right_margin,
    item_background_color,
    item_default_icon_color,
    item_font_color,
    item_height,
    item_left_padding,
    item_title_subtitle_margin,
    searchbar_automatch_font_color,
    searchbar_dragger_color,
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

  const { hotkey: clipboard_history_hotkey } = useSelector(
    (state: StateType) => state.clipboard_history
  );

  const debuggingConfig = useSelector(
    (state: StateType) => state.advanced_config
  );

  const { async_plugin_timer, max_action_log_count } = useSelector(
    (state: StateType) => state.advanced_config
  );

  const [isSpinning, setSpinning] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const [quicklookModalData, setQuicklookModalData] = useState<any>({
    type: undefined,
    data: undefined,
    active: false,
  });

  const [items, setItems] = useState<any[]>([]);

  const actionFlowManager = Core.ActionFlowManager.getInstance();

  const setDebuggingOptions = () => {
    actionFlowManager.loggerColorType = 'gui';
    actionFlowManager.printActionType = debuggingConfig.debugging_action;
    actionFlowManager.printPluginItems = debuggingConfig.debugging_plugin;
    actionFlowManager.printScriptfilter =
      debuggingConfig.debugging_scriptfilter;
    actionFlowManager.printScriptOutput = debuggingConfig.debugging_script;
    actionFlowManager.printTriggerStack =
      debuggingConfig.debugging_trigger_stack;
  };

  useEffect(() => {
    setDebuggingOptions();
  }, [debuggingConfig]);

  const dispatch = useDispatch();

  useIoHook();

  const {
    bestMatch,
    getInputProps,
    hasUnresolvedPluginPromises,
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
    setIsPinned,
    quicklookModalData,
    setQuicklookModalData,
    spinning: isSpinning,
  });

  const registerWindowUpdater = useCallback(() => {
    Core.setStoreAvailabiltyChecker((available) => setSpinning(!available));

    Core.Renderer.setOnInputShouldBeUpdate(onInputShouldBeUpdate);
    Core.Renderer.setOnItemPressHandler(onItemPressHandler);
    Core.Renderer.setOnItemShouldBeUpdate(onItemShouldBeUpdate);
    Core.Renderer.setOnWorkEndHandler(onWorkEndHandler);
  }, []);

  const initializeCustomActions = () => {
    Core.registerCustomAction('notification', notificationActionHandler);
    Core.registerCustomAction('clipboard', clipboardActionHandler);
    Core.registerCustomAction('keyDispatching', (action: any) => {});
  };

  const registerAllGlobalHotkey = () => {
    const hotkeys = Core.findHotkeys();

    ipcRenderer.send(IPCRendererEnum.setGlobalShortcut, {
      workflowHotkeyTbl: JSON.stringify(hotkeys),
      callbackTable: {
        [toggle_search_window_hotkey]: 'toggleSearchWindow',
        [clipboard_history_hotkey]: 'toggleClipboardHistoryWindow',
      },
    });
  };

  const renewHotkeys = () => {
    ipcRenderer.send(IPCRendererEnum.unregisterAllShortcuts);
    registerAllGlobalHotkey();
  };

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

    reloadWorkflow: (
      e: IpcRendererEvent,
      { bundleIds }: { bundleIds: string }
    ) => {
      const targets = bundleIds ? JSON.parse(bundleIds) : undefined;

      Core.reloadWorkflows(targets)
        .then(() => {
          return null;
        })
        .catch(console.error)
        .finally(() => {
          renewHotkeys();
        });
    },

    reloadPlugin: (
      e: IpcRendererEvent,
      { bundleIds }: { bundleIds: string }
    ) => {
      const targets = bundleIds ? JSON.parse(bundleIds) : undefined;

      Core.reloadPlugins({
        initializePluginWorkspace: true,
        bundleIds: targets,
      }).catch(console.error);
    },

    executeAction: (
      e: IpcRendererEvent,
      { bundleId, action }: { bundleId: string; action: any }
    ) => {
      actionFlowManager.isInitialTrigger = false;
      actionFlowManager.handleItemPressEvent(
        {
          actions: action,
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

    getElectronEnvsRet: (
      e: IpcRendererEvent,
      { externalEnvs }: { externalEnvs: string }
    ) => {
      Core.setExternalEnvs(JSON.parse(externalEnvs));
    },
  };

  const initilizeSearchWindowIPCHandler = useCallback(() => {
    ipcRenderer.on(IPCMainEnum.executeAction, ipcCallbackTbl.executeAction);
    ipcRenderer.on(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    ipcRenderer.on(IPCMainEnum.reloadPlugin, ipcCallbackTbl.reloadPlugin);
    ipcRenderer.on(IPCMainEnum.reloadWorkflow, ipcCallbackTbl.reloadWorkflow);
    ipcRenderer.on(IPCMainEnum.pinSearchWindow, ipcCallbackTbl.pinSearchWindow);
    ipcRenderer.on(
      IPCMainEnum.getElectronEnvsRet,
      ipcCallbackTbl.getElectronEnvsRet
    );
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
    ipcRenderer.off(IPCMainEnum.reloadPlugin, ipcCallbackTbl.reloadPlugin);
    ipcRenderer.off(IPCMainEnum.reloadWorkflow, ipcCallbackTbl.reloadWorkflow);
    ipcRenderer.off(
      IPCMainEnum.getElectronEnvsRet,
      ipcCallbackTbl.getElectronEnvsRet
    );
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
    return Core.reloadWorkflows()
      .then(() => {
        return null;
      })
      .catch(console.error)
      .finally(() => {
        registerAllGlobalHotkey();
      });
  }, []);

  const loadPluginsInfo = useCallback(() => {
    return Core.reloadPlugins({ initializePluginWorkspace: true }).catch(
      console.error
    );
  }, []);

  useEffect(() => {
    initializeCustomActions();
    initilizeSearchWindowIPCHandler();
    registerWindowUpdater();

    Promise.allSettled([loadWorkflowsInfo(), loadPluginsInfo()])
      .then(() => {
        console.log('Resource initialzed successfully.');
        return null;
      })
      .catch(console.error)
      .finally(() => {});

    ipcRenderer.send(IPCRendererEnum.getElectronEnvs, {
      sourceWindow: 'searchWindow',
    });

    Core.getSystemPaths()
      .then((result) => {
        Core.setMacPathsEnv(result);
        return null;
      })
      .catch(console.error);

    return unsubscribe;
  }, []);

  useEffect(() => {
    ipcRenderer.send(IPCRendererEnum.setSearchWindowWidth, {
      width: search_window_width,
    });
  }, [search_window_width]);

  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (
      (toggle_search_window_hotkey && toggle_search_window_hotkey !== '') ||
      (clipboard_history_hotkey && clipboard_history_hotkey !== '')
    ) {
      renewHotkeys();
    }
  }, [toggle_search_window_hotkey, clipboard_history_hotkey]);

  useEffect(() => {
    Core.setAsyncPluginTimer(async_plugin_timer);
  }, [async_plugin_timer]);

  useEffect(() => {
    Core.history.setMaxLogCnt(max_action_log_count);
  }, [max_action_log_count]);

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
    >
      <Quicklook {...quicklookModalData} searchbarHeight={searchbar_height} />

      <SpinnerContext.Provider value={[isSpinning, setSpinning]}>
        <SearchBar
          alwaysFocus
          bestMatch={bestMatch}
          hasDragger
          draggerColor={searchbar_dragger_color}
          getInputProps={getInputProps}
          isPinned={isPinned}
          itemLeftPadding={item_left_padding}
          searchbarAutomatchFontColor={searchbar_automatch_font_color}
          searchbarFontColor={searchbar_font_color}
          searchbarFontSize={searchbar_font_size}
          searchbarHeight={searchbar_height}
          spinning={isSpinning}
        />
        <SearchResultView
          demo={false}
          footerHeight={search_window_footer_height}
          haveUnresolvedItems={hasUnresolvedPluginPromises}
          iconRightMargin={icon_right_margin}
          itemBackgroundColor={item_background_color}
          itemDefaultIconColor={item_default_icon_color}
          itemFontColor={item_font_color}
          itemHeight={item_height}
          itemLeftPadding={item_left_padding}
          itemTitleSubtitleMargin={item_title_subtitle_margin}
          maxItemCount={max_item_count_to_show}
          noShowIcon={false}
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
      </SpinnerContext.Provider>
    </OuterContainer>
  );
}
