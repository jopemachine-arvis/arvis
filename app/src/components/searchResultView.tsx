/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import path from 'path';
import { Core } from 'wf-creator-core';
import _ from 'lodash';
import SearchResultItem from './searchResultItem';
import { checkFileExists } from '../utils';

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

  const [contents, setContents] = useState<any>();

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

  useEffect(() => {
    Promise.all(
      _.map(resultToRenders, async (command: any, offset: number) => {
        const itemIdx = startIdx + offset;
        const defaultIcon = '';
        const workflowDefaultIconPath = `${Core.path.workflowInstallPath}${path.sep}installed${path.sep}${command.bundleId}${path.sep}icon.png`;

        let iconPath = defaultIcon;
        if (command.icon) iconPath = command.icon.path;
        else if (await checkFileExists(workflowDefaultIconPath))
          iconPath = workflowDefaultIconPath;

        return (
          <InnerContainer key={`item-${offset}`}>
            <SearchResultItem
              selected={itemIdx === selectedItemIdx}
              title={command.title ? command.title : command.command}
              subtitle={command.subtitle}
              arg={command.arg}
              text={command.text}
              icon={iconPath}
              autocomplete={command.autocomplete}
              variables={command.variables}
              onMouseoverHandler={() => onMouseoverHandler(itemIdx)}
              onDoubleClickHandler={() => onDoubleClickHandler(itemIdx)}
            />
          </InnerContainer>
        );
      })
    ).then((result: any) => {
      setContents(result);
    });
  }, [resultToRenders]);

  return <OuterContainer>{contents}</OuterContainer>;
};

export default searchResultView;
