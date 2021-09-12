import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Core } from 'arvis-core';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import _ from 'lodash';
import {
  SearchBar,
  SearchResultView,
  SearchWindowScrollbar,
  Quicklook,
} from '@components/index';
import {
  useSearchWindowControl,
  useDoubleHotkey,
  useCopyKeyCapture,
} from '@hooks/index';
import { StateType } from '@redux/reducers/types';
import { applyAlphaColor, makeDefaultActionCreator } from '@utils/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SpinnerContext } from '@helper/spinnerContext';
import {
  clipboardActionHandler,
  notificationActionHandler,
  keyDispatchingActionHandler,
} from '@helper/customActionHandler';
import {
  registerWorkflowHotkeys,
  registerDefaultGlobalShortcuts,
} from '@config/shortcuts/globalShortcutHandler';
import { initializeDoubleKeyShortcuts } from '@config/shortcuts/doubleKeyShortcutCallbacks';
import { executeAction } from '@helper/executeAction';
import { getScriptExecutorPath } from '@config/path';
import { unloadIOHook } from '@utils/iohook/unloadIOHook';
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
    search_window_hotkey,
    clipboard_history_window_hotkey,
    universal_action_window_hotkey,
    snippet_window_hotkey,
  } = useSelector((state: StateType) => state.global_config);

  const debuggingConfig = useSelector(
    (state: StateType) => state.advanced_config
  );

  const { async_plugin_timer, max_action_log_count } = useSelector(
    (state: StateType) => state.advanced_config
  );

  const [isSpinning, setSpinning] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const [resizedSearchWindowWidth, setResizedWindowWidth] =
    useState<number>(search_window_width);

  const [quicklookData, setQuicklookData] = useState<QuicklookData>({
    type: undefined,
    data: undefined,
    active: false,
  });

  const [items, setItems] = useState<
    (Command | PluginItem | ScriptFilterItem)[]
  >([]);

  const [hoveringOnQuicklook, setHoveringOnQuicklook] =
    useState<boolean>(false);

  const actionFlowManager = Core.ActionFlowManager.getInstance();

  const setDebuggingOptions = () => {
    actionFlowManager.printActionType = debuggingConfig.debugging_action;
    actionFlowManager.printVariables = debuggingConfig.debugging_variables;
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

  const store = useStore();

  useDoubleHotkey();

  useCopyKeyCapture();

  const {
    autoSuggestion,
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
    hasDeferedPlugins,
  } = useSearchWindowControl({
    items,
    setItems,
    maxItemCount: max_item_count_to_show,
    maxRetrieveCount: max_item_count_to_search,
    isPinned,
    setIsPinned,
    hoveringOnQuicklook,
    quicklookData,
    setQuicklookData,
    spinning: isSpinning,
  });

  const registerRendererUpdater = useCallback(() => {
    Core.setStoreAvailabiltyChecker((available) => setSpinning(!available));

    Core.Renderer.setOnInputShouldBeUpdate(onInputShouldBeUpdate);
    Core.Renderer.setOnItemPressHandler(onItemPressHandler);
    Core.Renderer.setOnItemShouldBeUpdate(onItemShouldBeUpdate);
    Core.Renderer.setOnWorkEndHandler(onWorkEndHandler);
  }, []);

  const initializeCustomActions = () => {
    Core.registerCustomAction('notification', notificationActionHandler);
    Core.registerCustomAction('clipboard', clipboardActionHandler);
    Core.registerCustomAction('keyDispatching', keyDispatchingActionHandler);
  };

  const registerAllGlobalHotkeys = () => {
    const defaultHotkeyTbls = _.pickBy(
      {
        [search_window_hotkey]: 'toggleSearchWindow',
        [clipboard_history_window_hotkey]: 'toggleClipboardHistoryWindow',
        [universal_action_window_hotkey]: 'toggleUniversalActionWindow',
        [snippet_window_hotkey]: 'toggleSnippetWindow',
      },
      (value: string, key: string) => {
        return key;
      }
    );

    const hotkeys = Core.findHotkeys();

    // Register only double key press handler in renderer process.
    // Other hotkeys are registered in main process.
    registerWorkflowHotkeys(hotkeys);
    registerDefaultGlobalShortcuts(defaultHotkeyTbls);

    ipcRenderer.send(IPCRendererEnum.registerWorkflowHotkeys, {
      hotkeys: JSON.stringify(hotkeys),
    });

    ipcRenderer.send(IPCRendererEnum.setGlobalShortcut, {
      defaultCallbackTable: JSON.stringify(defaultHotkeyTbls),
    });
  };

  const renewHotkeys = () => {
    initializeDoubleKeyShortcuts();
    ipcRenderer.send(IPCRendererEnum.unregisterAllShortcuts);
    registerAllGlobalHotkeys();
  };

  const ipcCallbackTbl = {
    fetchAction: (
      e: IpcRendererEvent,
      { actionType, args }: { actionType: string; args: any }
    ) => {
      dispatch(makeDefaultActionCreator(actionType)(args));
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
      { bundleId, action }: { bundleId: string; action: Action[] }
    ) => {
      executeAction(bundleId, action);
    },

    registerAllShortcuts: (e: IpcRendererEvent) => {
      registerAllGlobalHotkeys();
    },

    pinSearchWindow: (e: IpcRendererEvent, { bool }: { bool: boolean }) => {
      setIsPinned(bool);
    },

    getElectronEnvsRet: (
      e: IpcRendererEvent,
      { externalEnvs }: { externalEnvs: string }
    ) => {
      const userUIConfig = store.getState().ui_config;
      const arvisUIConfig: any = {};

      for (const key of Object.keys(userUIConfig)) {
        arvisUIConfig[`arvis_ui_${key}`] = userUIConfig[key];
      }

      Core.setExternalEnvs({ ...arvisUIConfig, ...JSON.parse(externalEnvs) });
    },

    resizeCurrentSearchWindowWidth: (
      e: IpcRendererEvent,
      { width }: { width: number }
    ) => {
      setResizedWindowWidth(width);
    },
  };

  const initilizeSearchWindowIPCHandler = useCallback(() => {
    ipcRenderer.on(IPCMainEnum.executeAction, ipcCallbackTbl.executeAction);
    ipcRenderer.on(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    ipcRenderer.on(IPCMainEnum.reloadPlugin, ipcCallbackTbl.reloadPlugin);
    ipcRenderer.on(IPCMainEnum.reloadWorkflow, ipcCallbackTbl.reloadWorkflow);
    ipcRenderer.on(IPCMainEnum.pinSearchWindow, ipcCallbackTbl.pinSearchWindow);
    ipcRenderer.on(
      IPCMainEnum.resizeCurrentSearchWindowWidth,
      ipcCallbackTbl.resizeCurrentSearchWindowWidth
    );
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
      IPCMainEnum.resizeCurrentSearchWindowWidth,
      ipcCallbackTbl.resizeCurrentSearchWindowWidth
    );
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
      .catch(console.error)
      .finally(() => {
        registerAllGlobalHotkeys();
      });
  }, []);

  const loadPluginsInfo = useCallback(() => {
    return Core.reloadPlugins({ initializePluginWorkspace: true }).catch(
      console.error
    );
  }, []);

  const initializeScriptExecutor = () => {
    Core.setUseExecutorProcess(true);
    Core.startScriptExecutor({ execa: getScriptExecutorPath() });
  };

  useEffect(() => {
    return unloadIOHook;
  }, []);

  useEffect(() => {
    Core.setAsyncPluginTimer(async_plugin_timer);
  }, [async_plugin_timer]);

  useEffect(() => {
    Core.history.setMaxLogCnt(max_action_log_count);
  }, [max_action_log_count]);

  useEffect(() => {
    initializeCustomActions();
    initilizeSearchWindowIPCHandler();
    registerRendererUpdater();

    Promise.allSettled([loadWorkflowsInfo(), loadPluginsInfo()]).catch(
      console.error
    );

    ipcRenderer.send(IPCRendererEnum.getElectronEnvs, {
      sourceWindow: 'searchWindow',
    });

    Core.getShellPaths()
      .then((result) => {
        Core.setShellPathEnv(result);
        initializeScriptExecutor();
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
    // Prevent renewHotkeys call when when arvis start to run
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (
      search_window_hotkey ||
      clipboard_history_window_hotkey ||
      universal_action_window_hotkey ||
      snippet_window_hotkey
    ) {
      renewHotkeys();
    }
  }, [
    search_window_hotkey,
    clipboard_history_window_hotkey,
    universal_action_window_hotkey,
    snippet_window_hotkey,
  ]);

  useEffect(() => {
    ipcRenderer.send(IPCRendererEnum.resizeSearchWindowHeight, {
      itemCount: items.length,
      windowWidth: search_window_width,
      maxItemCount: max_item_count_to_show,
      itemHeight: item_height,
      searchbarHeight: searchbar_height,
      footerHeight: search_window_footer_height,
      forceMaxHeight: quicklookData.active,
    });
  }, [items, quicklookData.active]);

  useEffect(() => {
    return () => {
      Core.endScriptExecutor();
    };
  }, []);

  return (
    <OuterContainer
      id="searchWindow"
      onWheel={onWheelHandler}
      style={{
        borderRadius: search_window_border_radius,
        fontFamily: global_font,
        background: 'transparent',
        backgroundColor: applyAlphaColor(
          item_background_color,
          search_window_transparency
        ),
      }}
    >
      {items.length > 0 && (
        <Quicklook
          hovering={hoveringOnQuicklook}
          quicklookData={quicklookData}
          resizedSearchWindowWidth={resizedSearchWindowWidth}
          searchbarHeight={searchbar_height}
          searchWindowWidth={search_window_width}
          setHovering={setHoveringOnQuicklook}
          setQuicklookData={setQuicklookData}
        />
      )}
      <SpinnerContext.Provider value={[isSpinning, setSpinning]}>
        <SearchBar
          alwaysFocus
          autoSuggestion={autoSuggestion}
          draggerColor={searchbar_dragger_color}
          getInputProps={getInputProps}
          hasDragger
          isPinned={isPinned}
          itemLeftPadding={item_left_padding}
          searchbarAutomatchFontColor={searchbar_automatch_font_color}
          searchbarFontColor={searchbar_font_color}
          searchbarFontSize={searchbar_font_size}
          searchbarHeight={searchbar_height}
          spinning={isSpinning || hasDeferedPlugins}
        />
        <SearchResultView
          iconRightMargin={icon_right_margin}
          itemBackgroundColor={item_background_color}
          itemDefaultIconColor={item_default_icon_color}
          itemFontColor={item_font_color}
          itemHeight={item_height}
          itemLeftPadding={item_left_padding}
          itemTitleSubtitleMargin={item_title_subtitle_margin}
          maxItemCount={max_item_count_to_show}
          onDoubleClickHandler={onDoubleClickHandler}
          onMouseoverHandler={onMouseoverHandler}
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
