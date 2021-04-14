import React, { FC, useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import styled from 'styled-components';
import { SearchBar, SearchResultView } from '../../components';
import { maxItemCount, useControl } from '../../hooks/useControl';

const commandManager = new Core.CommandManager();

const Container = styled.div`
  flex-direction: column;
  width: 100vh;
`;

const App: FC<any> = () => {
  const [items, setItems] = useState<any>([]);
  const { inputStr, indexInfo, clearInput } = useControl({
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

    const command = inputStr.split(' ')[0];
    const result = Core.findCommands(command);
    setItems(result);
  };

  useEffect(() => {
    if (commandManager.commandStk.length === 0) {
      searchCommands();
    }
  }, [inputStr]);

  return (
    <Container>
      <SearchBar input={inputStr} />
      <SearchResultView
        startIdx={indexInfo.itemStartIdx}
        selectedItemIdx={indexInfo.selectedItemIdx}
        maxItemCount={maxItemCount}
        searchResult={items}
      />
    </Container>
  );
};

export default App;
