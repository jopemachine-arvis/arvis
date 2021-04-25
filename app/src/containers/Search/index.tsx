import React, { useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import styled from 'styled-components';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import { useSelector } from 'react-redux';
import { SearchBar, SearchResultView } from '../../components';
import { maxItemCount, useControl } from '../../hooks/useControl';
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
  const { item_background_color } = useSelector(
    (state: StateType) => state.uiConfig
  );

  const [items, setItems] = useState<any>([]);
  const clearItems = () => {
    setItems([]);
  };

  const {
    inputStr,
    indexInfo,
    clearInput,
    clearIndexInfo,
    getInputProps
  } = useControl({
    items,
    clearItems,
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
        return null;
      })
      .catch(error => {
        console.error(error);
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
    >
      <SearchBar input={inputStr} getInputProps={getInputProps} />
      <SearchResultView
        startIdx={indexInfo.itemStartIdx}
        selectedItemIdx={indexInfo.selectedItemIdx}
        maxItemCount={maxItemCount}
        searchResult={items}
      />
    </OuterContainer>
  );
}
