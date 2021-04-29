/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { SearchBar, SearchResultView } from '../../components';
import useControl from '../../hooks/useControl';
import { StateType } from '../../redux/reducers/types';

const commandManager = new Core.CommandManager({ printDebuggingInfo: true });

const OuterContainer = styled.div`
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100vh;
  border: 1px solid #585c67;
`;

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

  const { max_item_count_to_show } = useSelector(
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
    onItemShouldBeUpdate
  } = useControl({
    items,
    setItems,
    commandManager,
    maxItemCount: max_item_count_to_show
  });

  useEffect(() => {
    commandManager.onItemPressHandler = onItemPressHandler;
    commandManager.onItemShouldBeUpdate = onItemShouldBeUpdate;
  }, []);

  return (
    <OuterContainer
      style={{
        backgroundColor: item_background_color
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
