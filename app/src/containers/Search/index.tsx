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
`;

export default function SearchWindow() {
  const { item_background_color, item_height, searchbar_height } = useSelector(
    (state: StateType) => state.uiConfig
  );

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
          title: 'Unexpected error occured',
          subtitle: err,
          text: {
            copy: err,
            largetype: err
          }
        }
      ]);
    }
  };

  const {
    inputStr,
    setInputStr,
    indexInfo,
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
      <SearchBar setInputStr={setInputStr} />
      <SearchResultView
        itemHeight={item_height}
        startIdx={indexInfo.itemStartIdx}
        selectedItemIdx={indexInfo.selectedItemIdx}
        searchbarHeight={searchbar_height}
        maxItemCount={max_item_count_to_show}
        searchResult={items}
        onDoubleClickHandler={onDoubleClickHandler}
        onMouseoverHandler={onMouseoverHandler}
      />
    </OuterContainer>
  );
}
