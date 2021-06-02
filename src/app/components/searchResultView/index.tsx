/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo } from 'react';
import { ipcRenderer } from 'electron';
import path from 'path';
import { Core } from '@jopemachine/arvis-core';
import _ from 'lodash';
import { isSupportedImageFormat } from '@utils/index';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import SearchResultItem from '../searchResultItem';
import { InnerContainer, OuterContainer } from './components';

type IProps = {
  demo: boolean;
  footerHeight: number;
  iconRightMargin: number;
  itemBackgroundColor: string;
  itemFontColor: string;
  itemHeight: number;
  itemLeftPadding: number;
  itemTitleSubtitleMargin: number;
  maxItemCount: number;
  searchbarHeight: number;
  searchResult: any[];
  searchWindowWidth: number;
  searchWindowTransparency: number;
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
    iconRightMargin,
    itemBackgroundColor,
    itemFontColor,
    itemHeight,
    itemLeftPadding,
    itemTitleSubtitleMargin,
    maxItemCount,
    searchbarHeight,
    searchResult,
    searchWindowWidth,
    searchWindowTransparency,
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

  const determineIconPath = useCallback((command: any): string | undefined => {
    if (!command.bundleId) {
      console.error('bundleId is not set on the item', command);
      return undefined;
    }

    const workflowRootPath: string = Core.path.getWorkflowInstalledPath(
      command.bundleId
    );

    let iconPath;
    try {
      if (command.icon) {
        // In case of 'icon' is string
        if (command.icon.length) {
          command.icon = {
            path: command.icon,
          };
        }

        if (command.icon.path.includes('.')) {
          const iconExt = command.icon.path.split('.').pop();
          if (isSupportedImageFormat(iconExt)) {
            if (path.isAbsolute(command.icon.path)) {
              iconPath = command.icon.path;
            } else {
              iconPath = `${workflowRootPath}${path.sep}${command.icon.path}`;
            }
          }
        }
      }
    } catch (err) {
      // Assume command.icon.path is undefined
    }

    return iconPath;
  }, []);

  useEffect(() => {
    if (!demo) {
      ipcRenderer.send(IPCRendererEnum.resizeSearchWindowHeight, {
        itemCount: searchResult.length,
        maxItemCount,
        itemHeight,
        searchbarHeight,
        footerHeight,
      });
    }
  }, [searchResult]);

  return (
    <OuterContainer>
      {_.map(resultToRenders, (command: any, offset: number) => {
        const itemIdx: number = startIdx + offset;
        const iconPath: string | undefined = determineIconPath(command);

        return (
          <InnerContainer key={`searchResultViewItem-${offset}`}>
            <SearchResultItem
              offset={offset}
              selected={itemIdx === selectedItemIdx}
              // If there is no title, shows command
              title={command.title ? command.title : command.command}
              subtitle={command.subtitle}
              arg={command.arg}
              text={command.text}
              icon={iconPath}
              valid={command.valid}
              autocomplete={command.autocomplete}
              variables={command.variables}
              onMouseoverHandler={() => onMouseoverHandler(itemIdx)}
              onDoubleClickHandler={onDoubleClickHandler}
              iconRightMargin={iconRightMargin}
              itemBackgroundColor={itemBackgroundColor}
              itemFontColor={itemFontColor}
              itemHeight={itemHeight}
              itemLeftPadding={itemLeftPadding}
              itemTitleSubtitleMargin={itemTitleSubtitleMargin}
              selectedItemBackgroundColor={selectedItemBackgroundColor}
              selectedItemFontColor={selectedItemFontColor}
              subtitleFontSize={subtitleFontSize}
              titleFontSize={titleFontSize}
              searchWindowWidth={searchWindowWidth}
              searchWindowTransparency={searchWindowTransparency}
            />
          </InnerContainer>
        );
      })}
    </OuterContainer>
  );
};

export default React.memo(SearchResultView);
