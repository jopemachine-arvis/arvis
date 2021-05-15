/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useState } from 'react';
import { Core } from 'arvis-core';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { SearchBar, SearchResultView } from '../../components';
import useSearchWindowControl from '../../hooks/useSearchWindowControl';
import { StateType } from '../../redux/reducers/types';
import { OuterContainer } from './components';
import { applyAlphaColor, makeActionCreator } from '../../utils';
import { IPCMainEnum, IPCRendererEnum } from '../../ipc/ipcEventEnum';

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
    search_window_transparency,
    search_window_width,
    selected_item_background_color,
    selected_item_font_color,
    subtitle_font_size,
    title_font_size,
  } = useSelector((state: StateType) => state.ui_config);

  const { max_item_count_to_show, global_font } = useSelector(
    (state: StateType) => state.global_config
  );

  const debuggingConfig = useSelector(
    (state: StateType) => state.advanced_config
  );

  const [items, setItems] = useState<any>([]);

  const workManager = Core.WorkManager.getInstance();

  const setDebuggingOptions = () => {
    workManager.printActionType = debuggingConfig.debugging_action_type;
    workManager.printArgs = debuggingConfig.debugging_args;
    workManager.printScriptfilter = debuggingConfig.debugging_scriptfilter;
    workManager.printWorkflowOutput = debuggingConfig.debugging_workflow_output;
    workManager.printWorkStack = debuggingConfig.debugging_workstack;
  };

  useEffect(() => {
    setDebuggingOptions();
  }, [debuggingConfig]);

  const dispatch = useDispatch();

  const {
    setInputStr,
    indexInfo,
    getInputProps,
    onWheelHandler,
    onMouseoverHandler,
    onDoubleClickHandler,
    onItemPressHandler,
    onItemShouldBeUpdate,
    onWorkEndHandler,
    onInputShouldBeUpdate,
  } = useSearchWindowControl({
    items,
    setItems,
    maxItemCount: max_item_count_to_show,
  });

  const registerWindowUpdater = useCallback(() => {
    workManager.onInputShouldBeUpdate = onInputShouldBeUpdate;
    workManager.onItemPressHandler = onItemPressHandler;
    workManager.onItemShouldBeUpdate = onItemShouldBeUpdate;
    workManager.onWorkEndHandler = onWorkEndHandler;
  }, []);

  const initializeCustomActions = () => {
    Core.registerCustomAction('notification', (action: any) => {
      ipcRenderer.send(IPCRendererEnum.showNotification, {
        title: action.title,
        body: action.text,
      });
    });
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
      Core.renewWorkflows(bundleId);
    },
  };

  const initilizeSearchWindowIPCHandler = useCallback(() => {
    ipcRenderer.on(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    ipcRenderer.on(IPCMainEnum.renewWorkflow, ipcCallbackTbl.renewWorkflow);
    ipcRenderer.on(
      IPCMainEnum.setSearchbarInput,
      ipcCallbackTbl.setSearchbarInput
    );
  }, []);

  const unsubscribe = useCallback(() => {
    ipcRenderer.off(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    ipcRenderer.off(IPCMainEnum.renewWorkflow, ipcCallbackTbl.renewWorkflow);
    ipcRenderer.off(
      IPCMainEnum.setSearchbarInput,
      ipcCallbackTbl.setSearchbarInput
    );
  }, []);

  const loadWorkflowsInfo = useCallback(() => {
    Core.renewWorkflows();
  }, []);

  useEffect(() => {
    loadWorkflowsInfo();
    registerWindowUpdater();
    initializeCustomActions();
    initilizeSearchWindowIPCHandler();
    return unsubscribe;
  }, []);

  useEffect(() => {
    ipcRenderer.send(IPCRendererEnum.setSearchWindowWidth, {
      width: search_window_width,
    });
  }, [search_window_width]);

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
      <SearchBar
        alwaysFocus
        getInputProps={getInputProps}
        itemLeftPadding={item_left_padding}
        searchbarFontColor={searchbar_font_color}
        searchbarFontSize={searchbar_font_size}
        searchbarHeight={searchbar_height}
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
        selectedItemBackgroundColor={selected_item_background_color}
        selectedItemFontColor={selected_item_font_color}
        selectedItemIdx={indexInfo.selectedItemIdx}
        startIdx={indexInfo.itemStartIdx}
        subtitleFontSize={subtitle_font_size}
        titleFontSize={title_font_size}
      />
    </OuterContainer>
  );
}
