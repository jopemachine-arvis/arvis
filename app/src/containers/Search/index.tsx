/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import { useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import { SearchBar, SearchResultView } from '../../components';
import useSearchWindowControl from '../../hooks/useSearchWindowControl';
import { StateType } from '../../redux/reducers/types';
import { OuterContainer } from './components';

const workManager = new Core.WorkManager({ printDebuggingInfo: true });

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
    search_window_footer_height,
    selected_item_background_color,
    selected_item_font_color,
    subtitle_font_size,
    title_font_size
  } = useSelector((state: StateType) => state.uiConfig);

  const { max_item_count_to_show, global_font } = useSelector(
    (state: StateType) => state.globalConfig
  );

  const [items, setItems] = useState<any>([]);

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
    onInputShouldBeUpdate
  } = useSearchWindowControl({
    items,
    setItems,
    workManager,
    maxItemCount: max_item_count_to_show
  });

  useEffect(() => {
    workManager.onItemPressHandler = onItemPressHandler;
    workManager.onItemShouldBeUpdate = onItemShouldBeUpdate;
    workManager.onWorkEndHandler = onWorkEndHandler;
    workManager.onInputShouldBeUpdate = onInputShouldBeUpdate;

    Core.registerCustomAction('notification', (action: any) => {
      ipcRenderer.send('show-notification', {
        title: action.title,
        body: action.text
      });
    });
  }, []);

  return (
    <OuterContainer
      style={{
        backgroundColor: item_background_color,
        fontFamily: global_font
      }}
      onWheel={onWheelHandler}
    >
      <SearchBar
        alwaysFocus
        setInputStr={setInputStr}
        getInputProps={getInputProps}
        itemBackgroundColor={item_background_color}
        itemLeftPadding={item_left_padding}
        searchbarFontSize={searchbar_font_size}
        searchbarHeight={searchbar_height}
        searchbarFontColor={searchbar_font_color}
      />
      <SearchResultView
        demo={false}
        searchResult={items}
        startIdx={indexInfo.itemStartIdx}
        selectedItemIdx={indexInfo.selectedItemIdx}
        onDoubleClickHandler={onDoubleClickHandler}
        onMouseoverHandler={onMouseoverHandler}
        itemHeight={item_height}
        footerHeight={search_window_footer_height}
        searchbarHeight={searchbar_height}
        maxItemCount={max_item_count_to_show}
        iconRightMargin={icon_right_margin}
        itemBackgroundColor={item_background_color}
        itemFontColor={item_font_color}
        itemLeftPadding={item_left_padding}
        itemTitleSubtitleMargin={item_title_subtitle_margin}
        selectedItemBackgroundColor={selected_item_background_color}
        selectedItemFontColor={selected_item_font_color}
        subtitleFontSize={subtitle_font_size}
        titleFontSize={title_font_size}
      />
    </OuterContainer>
  );
}
