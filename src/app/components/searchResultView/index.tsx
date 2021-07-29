/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Core } from 'arvis-core';
import _ from 'lodash';
import QuickLRU from 'quick-lru';
import { supportedImageFormats as supportedImgFormats } from '@utils/index';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import SearchResultItem from '../searchResultItem';
import { InnerContainer, OuterContainer } from './components';

// Store icon paths occuring not found errors to prevent continuously occuring not found error
const cache: QuickLRU<string, boolean> = new QuickLRU({ maxSize: 1000 });

type IProps = {
  demo: boolean;
  footerHeight: number;
  haveUnresolvedItems: boolean;
  iconRightMargin: number;
  itemBackgroundColor: string;
  itemDefaultIconColor: string;
  itemFontColor: string;
  itemHeight: number;
  itemLeftPadding: number;
  itemTitleSubtitleMargin: number;
  maxItemCount: number;
  noShowIcon: boolean;
  searchbarHeight: number;
  searchResult: any[];
  searchWindowTransparency: number;
  searchWindowWidth: number;
  selectedItemBackgroundColor: string;
  selectedItemFontColor: string;
  selectedItemIdx: number;
  startIdx: number;
  subtitleFontSize: number;
  titleFontSize: number;
  onDoubleClickHandler: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onMouseoverHandler: (itemIdx: number) => void;
};

const SearchResultView = (props: IProps) => {
  const {
    demo,
    footerHeight,
    haveUnresolvedItems,
    iconRightMargin,
    itemBackgroundColor,
    itemDefaultIconColor,
    itemFontColor,
    itemHeight,
    itemLeftPadding,
    itemTitleSubtitleMargin,
    maxItemCount,
    noShowIcon,
    searchbarHeight,
    searchResult,
    searchWindowTransparency,
    searchWindowWidth,
    selectedItemBackgroundColor,
    selectedItemFontColor,
    selectedItemIdx,
    startIdx,
    subtitleFontSize,
    titleFontSize,
    onDoubleClickHandler,
    onMouseoverHandler,
  } = props;

  const resultToRenders: any[] = useMemo(
    () => searchResult.slice(startIdx, startIdx + maxItemCount),
    [props]
  );

  useEffect(() => {
    if (!demo) {
      ipcRenderer.send(IPCRendererEnum.resizeSearchWindowHeight, {
        itemCount: searchResult.length,
        windowWidth: searchWindowWidth,
        maxItemCount,
        itemHeight,
        searchbarHeight,
        footerHeight,
        haveUnresolvedItems,
      });
    }
  }, [searchResult, haveUnresolvedItems]);

  return (
    <OuterContainer id="searchResultView">
      {_.map(resultToRenders, (command: any, offset: number) => {
        const itemIdx: number = startIdx + offset;

        return (
          <InnerContainer key={`searchResultViewItem-${offset}`}>
            <SearchResultItem
              arg={command.arg}
              autocomplete={command.autocomplete}
              errorIcons={cache}
              extensionDefaultIcon={Core.determineDefaultIconPath(command)}
              icon={Core.determineIconPath(command, {
                supportedImgFormats,
              })}
              iconRightMargin={iconRightMargin}
              itemBackgroundColor={itemBackgroundColor}
              itemDefaultIconColor={itemDefaultIconColor}
              itemFontColor={itemFontColor}
              itemHeight={itemHeight}
              itemLeftPadding={itemLeftPadding}
              itemTitleSubtitleMargin={itemTitleSubtitleMargin}
              noShowIcon={noShowIcon}
              offset={offset}
              onDoubleClickHandler={onDoubleClickHandler}
              onMouseoverHandler={() => onMouseoverHandler(itemIdx)}
              searchWindowTransparency={searchWindowTransparency}
              searchWindowWidth={searchWindowWidth}
              selected={itemIdx === selectedItemIdx}
              selectedItemBackgroundColor={selectedItemBackgroundColor}
              selectedItemFontColor={selectedItemFontColor}
              subtitle={command.subtitle}
              subtitleFontSize={subtitleFontSize}
              text={command.text}
              // If there is no title, shows command
              title={command.title ?? command.command ?? '(no title)'}
              titleFontSize={titleFontSize}
              valid={command.valid}
              variables={command.variables}
            />
          </InnerContainer>
        );
      })}
    </OuterContainer>
  );
};

export default React.memo(SearchResultView);
