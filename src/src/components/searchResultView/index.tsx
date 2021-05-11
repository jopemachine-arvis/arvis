/* eslint-disable react/display-name */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
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
  onDoubleClickHandler: Function;
  onMouseoverHandler: Function;
  searchbarHeight: number;
  searchResult: any[];
  selectedItemBackgroundColor: string;
  selectedItemFontColor: string;
  selectedItemIdx: number;
  startIdx: number;
  subtitleFontSize: number;
  titleFontSize: number;
  searchWindowTransparency: number;
};

const searchResultView = React.memo((props: IProps) => {
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
    onDoubleClickHandler,
    onMouseoverHandler,
    searchbarHeight,
    searchResult,
    selectedItemBackgroundColor,
    selectedItemFontColor,
    selectedItemIdx,
    startIdx,
    subtitleFontSize,
    titleFontSize,
    searchWindowTransparency
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
      const iconExt = command.icon.path.split('.').pop();

      if (isSupportedImageFormat(iconExt)) {
        if (path.isAbsolute(command.icon.path)) {
          iconPath = command.icon.path;
        } else {
          iconPath = `${workflowRootPath}${path.sep}${command.icon.path}`;
        }
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
        footerHeight
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
});

export default searchResultView;
