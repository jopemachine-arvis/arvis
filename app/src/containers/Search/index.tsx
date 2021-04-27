/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import styled from 'styled-components';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import { useSelector } from 'react-redux';
import { SearchBar, SearchResultView } from '../../components';
import useControl from '../../hooks/useControl';
import { StateType } from '../../redux/reducers/types';

const commandManager = new Core.CommandManager();

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
  const clearItems = () => {
    setItems([]);
  };

  const setErrorItem = (err: any, errorItems: any[]) => {
    if (errorItems.length !== 0) {
      setItems(errorItems);
    } else {
      setItems([
        {
          valid: false,
          title: err.name,
          subtitle: err.message,
          text: {
            copy: err.message,
            largetype: err.message
          }
        }
      ]);
    }
  };

  const {
    inputStr,
    setInputStr,
    indexInfo,
    getInputProps,
    clearInput,
    clearIndexInfo,
    onScrollHandler,
    onMouseoverHandler,
    onDoubleClickHandler
  } = useControl({
    items,
    maxItemCount: max_item_count_to_show,
    clearItems,
    setErrorItem,
    commandManager
  });

  const itemSetEventHandler = (itemsToSet: any[]) => {
    clearIndexInfo();
    setItems(itemsToSet);
  };

  const searchCommands = () => {
    if (inputStr === '') {
      setItems([]);
      return;
    }

    const assumedCommand = inputStr.split(' ')[0];

    Core.findCommands(StoreType.Electron, assumedCommand)
      .then((result: any) => {
        setItems(result);
      })
      .catch(error => {
        throw new Error(`findCommands throws Error\n ${error}`);
      });
  };

  useEffect(() => {
    commandManager.onItemPressHandler = clearInput;
    commandManager.onItemShouldBeUpdate = itemSetEventHandler;
  }, []);

  useEffect(() => {
    if (commandManager.hasEmptyCommandStk()) {
      searchCommands();
    }
  }, [inputStr]);

  return (
    <OuterContainer
      style={{
        backgroundColor: item_background_color
      }}
      onWheel={onScrollHandler}
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
