/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import { IPCMainEnum } from '@ipc/ipcEventEnum';
import { makeActionCreator } from '@utils/index';
import { StateType } from '@redux/reducers/types';
import { useClipboardManagerWindowControl } from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  SearchWindowScrollbar,
  SearchBar,
  SearchResultView,
} from '@components/index';

import { InfoContainer, OuterContainer, SearchContainer } from './components';
import { style } from './style';
import './index.global.css';

const maxShow = 15;

const transformStore = (_store: any[]): any[] => {
  const items = _store.map((item) => {
    return {
      title: item.text,
      date: item.date,
    };
  });

  return items.reverse();
};

export default function ClipboardManagerWindow() {
  const { store } = useSelector((state: StateType) => state.clipboard_manager);

  const [items, setItems] = useState<any[]>(transformStore(store));

  const dispatch = useDispatch();

  const [searchContainerScrollbarVisible, setSearchContainerScrollbarVisible] =
    useState<boolean>(true);

  const ipcCallbackTbl = {
    fetchAction: (
      e: IpcRendererEvent,
      { actionType, args }: { actionType: string; args: any }
    ) => {
      dispatch(makeActionCreator(actionType, 'arg')(args));
    },

    renewClipboardStore: (e: IpcRendererEvent) => {
      setItems(transformStore(store));
    },
  };

  useEffect(() => {
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

  const {
    indexInfo,
    onDoubleClickHandler,
    onMouseoverHandler,
    onWheelHandler,
    getInputProps,
  } = useClipboardManagerWindowControl({
    items,
    setItems,
    maxItemCount: maxShow,
  });

  const infoContainerOnWheelHandler = () => {
    setSearchContainerScrollbarVisible(false);
  };

  return (
    <OuterContainer>
      <SearchContainer
        onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
          setSearchContainerScrollbarVisible(true);
          onWheelHandler(e);
        }}
      >
        <SearchBar
          alwaysFocus
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
          itemFontColor="#777777"
          itemHeight={style.itemHeight}
          itemLeftPadding={style.itemLeftPadding}
          itemTitleSubtitleMargin={0}
          maxItemCount={maxShow}
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
            maxShow={maxShow}
            scrollbarColor="#fff"
            scrollbarWidth={2}
            searchbarHeight={style.searchbarHeight}
            startItemIdx={indexInfo.itemStartIdx}
          />
        )}
      </SearchContainer>
      <InfoContainer
        id="clipboardManager-textarea"
        onWheel={infoContainerOnWheelHandler}
      >
        {items[indexInfo.selectedItemIdx].title}
      </InfoContainer>
    </OuterContainer>
  );
}
