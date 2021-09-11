import React, { useMemo } from 'react';
import { Core } from 'arvis-core';
import _ from 'lodash';
import QuickLRU from 'quick-lru';
import { supportedImageFormats as supportedImgFormats } from '@utils/index';
import SearchResultItem from '../searchResultItem';
import { InnerContainer, OuterContainer } from './components';

// Store icon paths occuring not found errors to prevent continuously occuring not found error
const cache: QuickLRU<string, boolean> = new QuickLRU({ maxSize: 1000 });

type IProps = {
  iconRightMargin: number;
  itemBackgroundColor: string;
  itemDefaultIconColor: string;
  itemFontColor: string;
  itemHeight: number;
  itemLeftPadding: number;
  itemTitleSubtitleMargin: number;
  maxItemCount: number;
  searchResult: (Command | PluginItem | ScriptFilterItem)[];
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
    iconRightMargin,
    itemBackgroundColor,
    itemDefaultIconColor,
    itemFontColor,
    itemHeight,
    itemLeftPadding,
    itemTitleSubtitleMargin,
    maxItemCount,
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

  return (
    <OuterContainer id="searchResultView">
      {_.map(
        resultToRenders,
        (command: Command | PluginItem | ScriptFilterItem, offset: number) => {
          const itemIdx: number = startIdx + offset;

          return (
            <InnerContainer key={`searchResultViewItem-${offset}`}>
              <SearchResultItem
                arg={(command as ScriptFilterItem).arg}
                autocomplete={(command as ScriptFilterItem).autocomplete}
                errorIcons={cache}
                extensionDefaultIcon={Core.determineDefaultIconPath(
                  command as Command
                )}
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
                offset={offset}
                onDoubleClickHandler={onDoubleClickHandler}
                onMouseoverHandler={() => onMouseoverHandler(itemIdx)}
                searchWindowTransparency={searchWindowTransparency}
                searchWindowWidth={searchWindowWidth}
                selected={itemIdx === selectedItemIdx}
                selectedItemBackgroundColor={selectedItemBackgroundColor}
                selectedItemFontColor={selectedItemFontColor}
                subtitle={command.subtitle ?? ''}
                subtitleFontSize={subtitleFontSize}
                text={(command as ScriptFilterItem | PluginItem).text}
                // If there is no title, shows command
                title={
                  command.title ?? (command as Command).command ?? '(no title)'
                }
                titleFontSize={titleFontSize}
                valid={(command as ScriptFilterItem | PluginItem).valid}
                variables={(command as ScriptFilterItem | PluginItem).variables}
              />
            </InnerContainer>
          );
        }
      )}
    </OuterContainer>
  );
};

export default React.memo(SearchResultView);
