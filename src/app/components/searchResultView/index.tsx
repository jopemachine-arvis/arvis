/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo } from 'react';
import { ipcRenderer } from 'electron';
import path from 'path';
import { Core } from 'arvis-core';
import _ from 'lodash';
import SearchResultItem from '../searchResultItem';
import { isSupportedImageFormat } from '../../utils';
import { InnerContainer, OuterContainer } from './components';
import { IPCRendererEnum } from '../../ipc/ipcEventEnum';

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
  searchWindowTransparency: number;
  selectedItemBackgroundColor: string;
  selectedItemFontColor: string;
  selectedItemIdx: number;
  startIdx: number;
  subtitleFontSize: number;
  titleFontSize: number;
  onDoubleClickHandler: (clickedItemIdx: number) => void;
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
    const workflowRootPath: string = Core.path.getWorkflowInstalledPath(
      command.bundleId
    );

    let iconPath;
    if (command.icon) {
      // command.icon is string
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
      } else {
        // Give icon to undefined
      }
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
              // To do :: Fix me!!
              title={command.title ? command.title : command.command}
              subtitle={command.subtitle}
              arg={command.arg}
              text={command.text}
              icon={iconPath}
              valid={command.valid}
              autocomplete={command.autocomplete}
              variables={command.variables}
              onMouseoverHandler={() => onMouseoverHandler(itemIdx)}
              onDoubleClickHandler={() => onDoubleClickHandler(itemIdx)}
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
              searchWindowTransparency={searchWindowTransparency}
            />
          </InnerContainer>
        );
      })}
    </OuterContainer>
  );
};

export default React.memo(SearchResultView);
