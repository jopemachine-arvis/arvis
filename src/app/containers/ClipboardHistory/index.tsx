/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useRef, useState } from 'react';
import useForceUpdate from 'use-force-update';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { makeActionCreator } from '@utils/index';
import { StateType } from '@redux/reducers/types';
import { useClipboardHistoryWindowControl } from '@hooks/index';
import { arvisAssetsPath } from '@config/path';
import { useDispatch, useSelector } from 'react-redux';
import path from 'path';
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

const maxShowOnScreen = 15;

const transformStore = (store: any[]): any[] => {
  const iconPath = path.resolve(
    arvisAssetsPath,
    'images',
    'clipboardHistoryItem.svg'
  );

  const items = store.map((item) => {
    return {
      title: item.text,
      bundleId: 'arvis.clipboardHistory',
      icon: {
        path: iconPath,
      },
      date: item.date,
    };
  });

  return items.reverse();
};

export default function ClipboardHistoryWindow() {
  const { global_font } = useSelector(
    (state: StateType) => state.global_config
  );

  const {
    apply_mouse_hover_event,
    store,
    max_size,
    max_show: max_show_on_window,
  } = useSelector((state: StateType) => state.clipboard_history);

  const [items, setItems] = useState<any[]>(
    transformStore(store).slice(0, max_show_on_window)
  );

  const [originalItems, setOriginalItems] = useState<any[]>(
    transformStore(store)
  );

  const [searchContainerScrollbarVisible, setSearchContainerScrollbarVisible] =
    useState<boolean>(true);

  const [isPinned, setIsPinned] = useState<boolean>(false);

  const forceUpdate = useForceUpdate();

  const dispatch = useDispatch();

  const maxShowOnWindowRef = useRef<number>(max_show_on_window);
  const storeRef = useRef<any>(store);

  storeRef.current = store;
  maxShowOnWindowRef.current = max_show_on_window;

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

  const ipcCallbackTbl = {
    fetchAction: (
      e: IpcRendererEvent,
      { actionType, args }: { actionType: string; args: any }
    ) => {
      dispatch(makeActionCreator(actionType, 'arg')(args));
    },

    renewClipboardStore: (e: IpcRendererEvent) => {
      forceUpdate();
      // wait until force update is done.
      setTimeout(() => {
        const newItems = transformStore(storeRef.current);
        setItems(newItems.slice(0, maxShowOnWindowRef.current));
        setOriginalItems(transformStore(storeRef.current));
        clearIndexInfo();
        setInputStr('');
        focusSearchbar();
      }, 15);
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
      ipcRenderer.off(
        IPCMainEnum.pinClipboardHistoryWindow,
        ipcCallbackTbl.pinClipboardHistoryWindow
      );
      ipcRenderer.off(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
      ipcRenderer.off(
        IPCMainEnum.renewClipboardStore,
        ipcCallbackTbl.renewClipboardStore
      );
    };
  }, []);

  useEffect(() => {
    setItems(transformStore(store).slice(0, max_show_on_window));
    setOriginalItems(transformStore(store));
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
