/* eslint-disable react/no-array-index-key */
import React, { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import SearchResultItem from './searchResultItem';

type IProps = {
  searchResult: any[];
  selectedItemIdx: number;
  startIdx: number;
  maxItemCount: number;
};

const Divider = styled.div`
  width: 100vh;
  border: 1px;
  border-color: #000000;
`;

const OuterContainer = styled.div`
  flex-direction: column;
  width: 100vh;
`;

const InnerContainer = styled.div`
  flex-direction: column;
  width: 100vh;
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
      {resultToRenders.map((command, index) => {
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
            />
            <Divider />
          </InnerContainer>
        );
      })}
    </OuterContainer>
  );
};

export default searchResultView;
