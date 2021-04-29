/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useState } from 'react';
import { ipcRenderer } from 'electron';
import path from 'path';
import { Core } from 'wf-creator-core';
import _ from 'lodash';
import SearchResultItem from '../searchResultItem';
import { checkFileExists, isSupportedImageFormat } from '../../utils';
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
};

const searchResultView = (props: IProps) => {
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
    titleFontSize
  } = props;

  const [contents, setContents] = useState<any>();

  const resultToRenders = useMemo(
    () => searchResult.slice(startIdx, startIdx + maxItemCount),
    [props]
  );

  const determineIconPath = async (
    command: any
  ): Promise<string | undefined> => {
    const workflowRootPath = `${Core.path.workflowInstallPath}${path.sep}installed${path.sep}${command.bundleId}`;
    const workflowDefaultIconPath = `${workflowRootPath}${path.sep}icon.png`;

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
    } else if (
      command.bundleId &&
      (await checkFileExists(workflowDefaultIconPath))
    ) {
      iconPath = workflowDefaultIconPath;
    }

    return iconPath;
  };

  useEffect(() => {
    if (!demo) {
      ipcRenderer.send('resize-searchwindow-height', {
        itemCount: searchResult.length,
        maxItemCount,
        itemHeight,
        searchbarHeight,
        footerHeight
      });
    }
  }, [searchResult]);

  useEffect(() => {
    Promise.all(
      _.map(resultToRenders, async (command: any, offset: number) => {
        const itemIdx = startIdx + offset;
        const iconPath = await determineIconPath(command);

        return (
          <InnerContainer key={`item-${offset}`}>
            <SearchResultItem
              selected={itemIdx === selectedItemIdx}
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
