/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import SearchResultItem from './searchResultItem';

type IProps = {
  itemHeight: number;
  searchResult: any[];
  searchbarHeight: number;
  selectedItemIdx: number;
  startIdx: number;
  maxItemCount: number;
  onMouseoverHandler: Function;
  onDoubleClickHandler: Function;
};

const OuterContainer = styled.div`
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const InnerContainer = styled.div`
  flex-direction: column;
  width: 100%;
`;

const searchResultView = (props: IProps) => {
  const {
    itemHeight,
    searchbarHeight,
    searchResult,
    startIdx,
    maxItemCount,
    selectedItemIdx,
    onDoubleClickHandler,
    onMouseoverHandler
  } = props;

  const resultToRenders = useMemo(
    () => searchResult.slice(startIdx, startIdx + maxItemCount),
    [props]
  );

  useEffect(() => {
    ipcRenderer.send('resize-searchwindow-height', {
      itemCount: searchResult.length,
      maxItemCount,
      itemHeight,
      searchbarHeight
    });
  }, [searchResult]);

  return (
    <OuterContainer>
      {resultToRenders.map((command: any, index: number) => {
        const itemIdx = startIdx + index;
        return (
          <InnerContainer key={`item-${index}`}>
            <SearchResultItem
              selected={itemIdx === selectedItemIdx}
              title={command.title ? command.title : command.command}
              subtitle={command.subtitle}
              arg={command.arg}
              text={command.text}
              autocomplete={command.autocomplete}
              variables={command.variables}
              onMouseoverHandler={() => onMouseoverHandler(itemIdx)}
              onDoubleClickHandler={() => onDoubleClickHandler(itemIdx)}
            />
          </InnerContainer>
        );
      })}
    </OuterContainer>
  );
};

export default searchResultView;
