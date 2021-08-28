/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { makeActionCreator } from '@utils/index';
import { StateType } from '@redux/reducers/types';
import { useClipboardHistoryWindowControl } from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  SearchWindowScrollbar,
  SearchBar,
  SearchResultView,
} from '@components/index';
import {
  InfoContainer,
  OuterContainer,
  SearchContainer,
  InfoInnerContainer,
  CopyDateTime,
} from './components';
import { style } from './style';
import './index.css';
import useAssistanceMode from './mode';

const maxShowOnScreen = 15;

export default function AssistanceWindow() {
  const { global_font } = useSelector(
    (state: StateType) => state.global_config
  );

  const {
    apply_mouse_hover_event,
    // store,
    max_size,
    max_show: max_show_on_window,
  } = useSelector((state: StateType) => state.clipboard_history);

  const [searchContainerScrollbarVisible, setSearchContainerScrollbarVisible] =
    useState<boolean>(true);

  const [isPinned, setIsPinned] = useState<boolean>(false);

  const dispatch = useDispatch();

  let renewHandler = () => {};

  const [mode, setMode] =
    useState<'clipboardHistory' | 'universalAction'>('clipboardHistory');

  const { items, originalItems, setItems, setOriginalItems } =
    useAssistanceMode({
      mode,
      renewHandler,
      maxShowOnScreen,
      maxShowOnWindow: max_show_on_window,
    });

  const {
    indexInfo,
    clearIndexInfo,
    focusSearchbar,
    setInputStr,
    onDoubleClickHandler,
    onMouseoverHandler,
    onWheelHandler,
    getInputProps,
  } = useClipboardHistoryWindowControl({
    items,
    originalItems,
    setItems,
    isPinned,
    setIsPinned,
    applyMouseHoverEvent: apply_mouse_hover_event,
    maxShowOnScreen,
    maxShowOnWindow: max_show_on_window,
  });

  renewHandler = () => {
    clearIndexInfo();
    setInputStr('');
    focusSearchbar();
  };

  const ipcCallbackTbl = {
    fetchAction: (
      e: IpcRendererEvent,
      { actionType, args }: { actionType: string; args: any }
    ) => {
      dispatch(makeActionCreator(actionType, 'arg')(args));
    },

    pinClipboardHistoryWindow: (
      e: IpcRendererEvent,
      { bool }: { bool: boolean }
    ) => {
      setIsPinned(bool);
    },
  };

  useEffect(() => {
    ipcRenderer.on(
      IPCMainEnum.pinAssistanceWindow,
      ipcCallbackTbl.pinClipboardHistoryWindow
    );
    ipcRenderer.on(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);

    return () => {
      ipcRenderer.off(
        IPCMainEnum.pinAssistanceWindow,
        ipcCallbackTbl.pinClipboardHistoryWindow
      );
      ipcRenderer.off(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    };
  }, []);

  const infoContainerOnWheelHandler = () => {
    setSearchContainerScrollbarVisible(false);
  };

  const outerContainerKeydownEventHandler = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === 'Escape') {
      ipcRenderer.send(IPCRendererEnum.hideAssistanceWindow);
    }
  };

  const rightClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    ipcRenderer.send(IPCRendererEnum.popupAssistanceWindowContextMenu, {
      isPinned,
    });
  };

  return (
    <OuterContainer
      id="assistanceWindowOuterContainer"
      tabIndex={0}
      style={{ fontFamily: global_font }}
      onContextMenu={rightClickHandler}
      onKeyDown={outerContainerKeydownEventHandler}
    >
      <SearchContainer
        onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
          setSearchContainerScrollbarVisible(true);
          onWheelHandler(e);
        }}
      >
        <SearchBar
          alwaysFocus={false}
          draggerColor="#fff"
          getInputProps={getInputProps}
          hasContextMenu={false}
          hasDragger
          isPinned={false}
          itemLeftPadding={style.itemLeftPadding}
          searchbarAutomatchFontColor="#fff"
          searchbarFontColor="#fff"
          searchbarFontSize={style.searchbarFontSize}
          searchbarHeight={style.searchbarHeight}
          spinning={false}
        />
        <SearchResultView
          iconRightMargin={10}
          itemDefaultIconColor="#fff"
          itemBackgroundColor="#ccc"
          itemFontColor="#888888"
          itemHeight={style.itemHeight}
          itemLeftPadding={style.itemLeftPadding}
          itemTitleSubtitleMargin={0}
          maxItemCount={maxShowOnScreen}
          onDoubleClickHandler={onDoubleClickHandler}
          onMouseoverHandler={onMouseoverHandler}
          searchResult={items}
          searchWindowTransparency={100}
          searchWindowWidth={1200}
          selectedItemBackgroundColor="#ddd"
          selectedItemFontColor="#fff"
          selectedItemIdx={indexInfo.selectedItemIdx}
          startIdx={indexInfo.itemStartIdx}
          subtitleFontSize={0}
          titleFontSize={style.itemFontSize}
        />
        {searchContainerScrollbarVisible && (
          <SearchWindowScrollbar
            footerHeight={style.footerHeight}
            itemHeight={style.itemHeight}
            itemLength={items.length}
            maxShow={maxShowOnScreen}
            scrollbarColor="#fff"
            scrollbarWidth={2}
            searchbarHeight={style.searchbarHeight}
            startItemIdx={indexInfo.itemStartIdx}
            positionStyle={{
              position: 'absolute',
              left: '50%',
            }}
          />
        )}
      </SearchContainer>
      <InfoContainer
        id="assistanceWindowTextarea"
        onWheel={infoContainerOnWheelHandler}
      >
        <InfoInnerContainer>
          {items[indexInfo.selectedItemIdx]
            ? items[indexInfo.selectedItemIdx].title
            : ''}
        </InfoInnerContainer>
        <CopyDateTime>
          {items[indexInfo.selectedItemIdx] &&
            `Copied on ${new Date(
              items[indexInfo.selectedItemIdx].date
            ).toLocaleString()}`}
        </CopyDateTime>
      </InfoContainer>
    </OuterContainer>
  );
}
