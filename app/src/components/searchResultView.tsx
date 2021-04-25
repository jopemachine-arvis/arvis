/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import styled from 'styled-components';
import SearchResultItem from './searchResultItem';

type IProps = {
  searchResult: any[];
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
  const resultToRenders = useMemo(
    () =>
      props.searchResult.slice(
        props.startIdx,
        props.startIdx + props.maxItemCount
      ),
    [props]
  );

  return (
    <OuterContainer>
      {resultToRenders.map((command: any, index: number) => {
        return (
          <InnerContainer key={`item-${index}`}>
            <SearchResultItem
              selected={props.startIdx + index === props.selectedItemIdx}
              title={command.title ? command.title : command.command}
              subtitle={command.subtitle}
              arg={command.arg}
              text={command.text}
              autocomplete={command.autocomplete}
              variables={command.variables}
              onMouseoverHandler={() => props.onMouseoverHandler(index)}
              onDoubleClickHandler={() => props.onDoubleClickHandler(index)}
            />
          </InnerContainer>
        );
      })}
    </OuterContainer>
  );
};

export default searchResultView;
