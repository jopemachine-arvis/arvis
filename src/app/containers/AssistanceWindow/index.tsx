import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useRef, useState } from 'react';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { StateType } from '@redux/reducers/types';
import {
  useAssistanceWindowControl,
  useCopyKeyCapture,
  useReduxFetcher,
  useSnippet,
} from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  SearchWindowScrollbar,
  SearchBar,
  SearchResultView,
} from '@components/index';
import useSnippetKeywords from '@hooks/useSnippetKeywords';
import { InfoContainer, OuterContainer, SearchContainer } from './components';
import { style } from './style';
import './index.css';
import useClipboardHistoryMode from './mode/useClipboardHistory';
import useUniversalActionMode from './mode/useUniversalAction';
import useSnippetMode from './mode/useSnippet';
import * as ClipboardHistory from '../../store/clipboardHistoryStorage';

const maxShowOnScreen = 15;

const maxShowOnWindow = 50;

const onWindowOpenEventHandlers = new Map<AssistanceWindowType, () => void>();

ClipboardHistory.importClipboardHistoryStorage();

export default function AssistanceWindow() {
  const { global_font } = useSelector(
    (state: StateType) => state.global_config
  );

  const { apply_mouse_hover_event, max_size } = useSelector(
    (state: StateType) => state.clipboard_history
  );

  const [items, setItems] = useState<any[]>([]);

  const [originalItems, setOriginalItems] = useState<any[]>([]);

  const [searchContainerScrollbarVisible, setSearchContainerScrollbarVisible] =
    useState<boolean>(true);

  const [isPinned, setIsPinned] = useState<boolean>(false);

  const dispatch = useDispatch();

  const renewHandler = useRef<() => void>(() => {});

  const [mode, setMode] = useState<AssistanceWindowType | undefined>(undefined);

  const { snippets, snippetCollectionInfos } = useSnippet();

  useCopyKeyCapture();

  useReduxFetcher();

  useSnippetKeywords({ snippets, collectionInfo: snippetCollectionInfos });

  const {
    indexInfo,
    clearIndexInfo,
    focusSearchbar,
    setInputStr,
    onDoubleClickHandler,
    onMouseoverHandler,
    onWheelHandler,
    getInputProps,
  } = useAssistanceWindowControl({
    mode,
    items,
    originalItems,
    setItems,
    isPinned,
    setIsPinned,
    applyMouseHoverEvent: apply_mouse_hover_event,
    maxShowOnScreen,
    maxShowOnWindow,
  });

  const { renderInfoContent: renderClipboardHistoryInfoContent } =
    useClipboardHistoryMode({
      store: ClipboardHistory.store!,
      items,
      setItems,
      originalItems,
      setOriginalItems,
      indexInfo,
      mode,
      maxShowOnScreen,
      maxShowOnWindow,
      renewHandler,
      onWindowOpenEventHandlers,
    });

  const { renderInfoContent: renderUniversalActionInfoContent } =
    useUniversalActionMode({
      items,
      setItems,
      originalItems,
      setOriginalItems,
      mode,
      maxShowOnScreen,
      maxShowOnWindow,
      renewHandler,
      onWindowOpenEventHandlers,
    });

  const { renderInfoContent: renderSnippetInfoContent } = useSnippetMode({
    items,
    setItems,
    originalItems,
    setOriginalItems,
    indexInfo,
    mode,
    snippets,
    snippetCollectionInfos,
    maxShowOnScreen,
    maxShowOnWindow,
    renewHandler,
    onWindowOpenEventHandlers,
  });

  const renderInfoContent = () => {
    if (mode === 'clipboardHistory') return renderClipboardHistoryInfoContent();
    if (mode === 'universalAction') return renderUniversalActionInfoContent();
    if (mode === 'snippet') return renderSnippetInfoContent();
    return <></>;
  };

  const ipcCallbackTbl = {
    setMode: (
      e: IpcRendererEvent,
      { mode: modeToSet }: { mode: AssistanceWindowType }
    ) => {
      setMode(modeToSet);
      renewHandler.current();

      if (onWindowOpenEventHandlers.has(modeToSet)) {
        onWindowOpenEventHandlers.get(modeToSet)!();
      }
    },

    pinAssistanceWindow: (e: IpcRendererEvent, { bool }: { bool: boolean }) => {
      setIsPinned(bool);
    },
  };

  useEffect(() => {
    renewHandler.current = () => {
      clearIndexInfo();
      setInputStr('');
      focusSearchbar();
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.setMode, ipcCallbackTbl.setMode);
    ipcRenderer.on(
      IPCMainEnum.pinAssistanceWindow,
      ipcCallbackTbl.pinAssistanceWindow
    );

    return () => {
      ipcRenderer.off(IPCMainEnum.setMode, ipcCallbackTbl.setMode);
      ipcRenderer.off(
        IPCMainEnum.pinAssistanceWindow,
        ipcCallbackTbl.pinAssistanceWindow
      );
    };
  }, []);

  useEffect(() => {
    ClipboardHistory.setStoreMaxSize(max_size);
  }, [max_size]);

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
        {renderInfoContent()}
      </InfoContainer>
    </OuterContainer>
  );
}
