import React, { FC, useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import styled from 'styled-components';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import { SearchBar, SearchResultView } from '../../components';
import { maxItemCount, useControl } from '../../hooks/useControl';

const commandManager = new Core.CommandManager();

const Container = styled.div`
  flex-direction: column;
  width: 100vh;
  justify-content: center;
  align-items: center;
`;

export default function SearchWindow() {
  const [items, setItems] = useState<any>([]);
  const { inputStr, indexInfo, clearInput, getInputProps } = useControl({
    items,
    commandManager
  });

  useEffect(() => {
    commandManager.onItemPressHandler = clearInput;
    commandManager.onItemShouldBeUpdate = setItems;
  }, []);

  const searchCommands = () => {
    if (inputStr === '') {
      setItems([]);
      return;
    }

    const assumedCommand = inputStr.split(' ')[0];

    Core.findCommands(StoreType.Electron, assumedCommand)
      .then((result: any) => {
        console.log('command', assumedCommand);
        console.log('res', result);
        setItems(result);
        return null;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (commandManager.hasEmptyCommandStk()) {
      searchCommands();
    }
  }, [inputStr]);

  return (
    <Container>
      <SearchBar input={inputStr} getInputProps={getInputProps} />
      <SearchResultView
        startIdx={indexInfo.itemStartIdx}
        selectedItemIdx={indexInfo.selectedItemIdx}
        maxItemCount={maxItemCount}
        searchResult={items}
      />
    </Container>
  );
}
