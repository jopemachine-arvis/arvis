/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useRef, useState } from 'react';
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
import './index.global.css';

const maxShowOnScreen = 15;

const transformStore = (
  store: any[],
  options: { maxShowOnWindow: number }
): any[] => {
  const items = store.map((item) => {
    return {
      title: item.text,
      date: item.date,
    };
  });

  return items.reverse().slice(0, options.maxShowOnWindow);
};

export default function ClipboardHistoryWindow() {
  const { global_font } = useSelector(
    (state: StateType) => state.global_config
  );

  const {
    store,
    max_size,
    max_show: max_show_on_window,
  } = useSelector((state: StateType) => state.clipboard_history);

  const [items, setItems] = useState<any[]>(
    transformStore(store, { maxShowOnWindow: max_show_on_window })
  );

  const [originalItems, setOriginalItems] = useState<any[]>(
    transformStore(store, { maxShowOnWindow: max_show_on_window })
  );

  const dispatch = useDispatch();

  const [searchContainerScrollbarVisible, setSearchContainerScrollbarVisible] =
    useState<boolean>(true);

  const [isPinned, setIsPinned] = useState<boolean>(false);

  const maxShowOnWindowRef = useRef<number>(max_show_on_window);

  const {
    indexInfo,
    clearIndexInfo,
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
    maxShowOnScreen,
    maxShowOnWindow: max_show_on_window,
  });

  const ipcCallbackTbl = {
    fetchAction: (
      e: IpcRendererEvent,
      { actionType, args }: { actionType: string; args: any }
    ) => {
      dispatch(makeActionCreator(actionType, 'arg')(args));
    },

    renewClipboardStore: (e: IpcRendererEvent) => {
      setItems(
        transformStore(store, { maxShowOnWindow: maxShowOnWindowRef.current })
      );
      setOriginalItems(
        transformStore(store, { maxShowOnWindow: maxShowOnWindowRef.current })
      );
      clearIndexInfo();
      setInputStr('');
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
      IPCMainEnum.pinClipboardHistoryWindow,
      ipcCallbackTbl.pinClipboardHistoryWindow
    );
    ipcRenderer.on(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    ipcRenderer.on(
      IPCMainEnum.renewClipboardStore,
      ipcCallbackTbl.renewClipboardStore
    );

    return () => {
      ipcRenderer.off(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
      ipcRenderer.off(
        IPCMainEnum.renewClipboardStore,
        ipcCallbackTbl.renewClipboardStore
      );
    };
  }, []);

  useEffect(() => {
    maxShowOnWindowRef.current = max_show_on_window;
  });

  useEffect(() => {
    setItems(transformStore(store, { maxShowOnWindow: max_show_on_window }));
    setOriginalItems(
      transformStore(store, { maxShowOnWindow: max_show_on_window })
    );
  }, [max_size, max_show_on_window]);

  const infoContainerOnWheelHandler = () => {
    setSearchContainerScrollbarVisible(false);
  };

  const outerContainerKeydownEventHandler = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === 'Escape') {
      ipcRenderer.send(IPCRendererEnum.hideClipboardHistoryWindow);
    }
  };

  const rightClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    ipcRenderer.send(IPCRendererEnum.popupClipboardHistoryContextMenu, {
      isPinned,
    });
  };

  return (
    <OuterContainer
      id="clipboardHistoryOuterContainer"
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
          getInputProps={getInputProps}
          hasContextMenu={false}
          isPinned={false}
          itemLeftPadding={style.itemLeftPadding}
          searchbarFontColor="#fff"
          searchbarFontSize={style.searchbarFontSize}
          searchbarHeight={style.searchbarHeight}
          spinning={false}
        />
        <SearchResultView
          demo
          footerHeight={style.footerHeight}
          iconRightMargin={0}
          itemBackgroundColor="#ccc"
          itemFontColor="#888888"
          itemHeight={style.itemHeight}
          itemLeftPadding={style.itemLeftPadding}
          itemTitleSubtitleMargin={0}
          maxItemCount={maxShowOnScreen}
          noShowIcon
          onDoubleClickHandler={onDoubleClickHandler}
          onMouseoverHandler={onMouseoverHandler}
          searchbarHeight={style.searchbarHeight}
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
        id="clipboardHistory-textarea"
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
