/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { Core } from 'arvis-core';
import useForceUpdate from 'use-force-update';
import { constant, searchMostTotalDownload } from 'arvis-store';
import open from 'open';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { IoMdRefresh } from 'react-icons/io';
import semver from 'semver';
import { SearchBar, StyledInput } from '@components/index';
import { useStoreSearchControl } from '@hooks/index';
import { SpinnerContext } from '@helper/spinnerContext';
import ExtensionInfoTable from './infoTable';
import ExtensionDefaultImg from '../../../../../assets/images/extensionDefaultIcon.svg';
import {
  installExtension,
  uninstallExtension,
} from './extensionDownloadHandler';
import {
  Header,
  OuterContainer,
  ExtensionDescContainer,
  SearchbarContainer,
  ExtensionItemContainer,
  ExtensionItemCreatorText,
  ExtensionItemTitle,
  ExtensionListOrderedList,
  ExtensionListView,
  ExtensionListViewFooter,
  TabNavigatorContainer,
  ExtensionItemDescText,
  ExtensionImg,
  InstallMark,
  SearchResultText,
  SearchbarDescriptionContainer,
} from './components';
import './index.global.css';
import * as style from './style';

type IProps = {
  allStoreExtensions: any[];
};

const sortTxtDict: any = {
  dt: '▼ Total download',
  dw: '▼ Last week download',
  uploaded: '▼ Uploaded time',
  name: '▼ Name',
};

const needToReverse: string[] = ['dt', 'dw', 'uploaded'];

const filterSupportedExtensions = (extensions: any[]) => {
  return extensions.filter(
    (extension) =>
      !extension.platform || extension.platform.includes(process.platform)
  );
};

export default function Store(props: IProps) {
  const { allStoreExtensions } = props;
  const [allExtensions, setAllExtensions] = useState<any[]>(
    filterSupportedExtensions(allStoreExtensions)
  );

  const [extensions, setExtensions] = useState<any[]>(allExtensions);

  const [selectedExtensionIdx, setSelectedExtensionIdx] = useState<number>(-1);

  const [extensionBundleId, setExtensionBundleId] = useState<string>('');
  const [webviewUrl, setWebviewUrl] = useState<string | undefined>('');

  const { setInputStr, getInputProps } = useStoreSearchControl({
    items: extensions,
    originalItems: allExtensions,
    setItems: setExtensions,
  });

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const [sortBy, setSortBy] = useState<string>('dt');

  const forceUpdate = useForceUpdate();

  const installed = [
    ...Object.keys(Core.getWorkflowList()),
    ...Object.keys(Core.getPluginList()),
  ];

  const refreshStore = () => {
    setSpinning(true);
    setSortBy('dt');
    searchMostTotalDownload()
      .then((newExtensions) => {
        const supportedNewExts = filterSupportedExtensions(newExtensions);
        setAllExtensions(supportedNewExts);
        setSpinning(false);
        return null;
      })
      .catch(console.error);
  };

  const itemClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    setSelectedExtensionIdx(idx);
    forceUpdate();
  };

  const sortExtensions = () => {
    const [canSortItems, cannotSortItems] = _.partition(
      allExtensions,
      (item) => item[sortBy]
    );
    const sortedItems = needToReverse.includes(sortBy)
      ? _.sortBy(canSortItems, sortBy).reverse()
      : _.sortBy(canSortItems, sortBy);

    setAllExtensions(_.concat(sortedItems, cannotSortItems));
  };

  useEffect(() => {
    setExtensions(allStoreExtensions);
  }, [allStoreExtensions]);

  useEffect(() => {
    sortExtensions();
  }, [sortBy]);

  useEffect(() => {
    if (extensions.length) {
      const info =
        selectedExtensionIdx === -1 ? {} : extensions[selectedExtensionIdx];

      if (!info) return;

      const { creator = '', name = '', webAddress = '' } = info;

      const bundleId =
        selectedExtensionIdx === -1 ? '' : Core.getBundleId(creator, name);

      setExtensionBundleId(bundleId);
      setWebviewUrl(webAddress);
    }
  }, [selectedExtensionIdx, extensions]);

  const itemDoubleClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    open(extensions[idx].webAddress);
  };

  const renderItem = (extension: any, idx: number) => {
    if (!extension) return <React.Fragment key={`extensionItem-${idx}`} />;
    const { creator, name, description, type, latest } = extension;
    const bundleId = Core.getBundleId(creator, name);

    const extensionItemStyle =
      selectedExtensionIdx === idx ? style.selectedItemStyle : {};

    const installedExtensionInfo: any | undefined =
      type === 'workflow'
        ? Core.getWorkflowList()[bundleId]
        : Core.getPluginList()[bundleId];

    const currentVersion = installedExtensionInfo
      ? installedExtensionInfo.version
      : undefined;

    return (
      <ExtensionItemContainer
        style={extensionItemStyle}
        key={`extensionItem-${idx}`}
        onClick={(e) => itemClickHandler(e, idx)}
        onDoubleClick={(e) => itemDoubleClickHandler(e, idx)}
      >
        <ExtensionImg
          src={`${constant.extensionIconUrl}/${type}/${bundleId}.png`}
          onError={(e) => {
            e.currentTarget.src = ExtensionDefaultImg;
          }}
        />
        {installed.includes(bundleId) &&
          latest &&
          currentVersion &&
          semver.gte(currentVersion, latest) && (
            <InstallMark
              style={{
                backgroundColor: '#7bbb3e88',
              }}
            >
              installed
            </InstallMark>
          )}
        {installed.includes(bundleId) &&
          latest &&
          currentVersion &&
          semver.gt(latest, currentVersion) && (
            <InstallMark
              style={{
                backgroundColor: '#ffff00aa',
              }}
            >
              updatable
            </InstallMark>
          )}
        <ExtensionItemTitle>{name}</ExtensionItemTitle>
        <ExtensionItemCreatorText>{`${creator}`}</ExtensionItemCreatorText>
        <ExtensionItemDescText>{`${description}`}</ExtensionItemDescText>
      </ExtensionItemContainer>
    );
  };

  return (
    <OuterContainer id="extension-page-container" tabIndex={0}>
      <Header
        style={{
          marginLeft: 40,
        }}
      >
        Store
      </Header>
      <ExtensionListView>
        <SearchbarContainer>
          <SearchBar
            alwaysFocus={false}
            hasDragger={false}
            getInputProps={getInputProps}
            hasContextMenu={false}
            isPinned={false}
            itemLeftPadding={style.searchBarStyle.itemLeftPadding}
            searchbarAutomatchFontColor="#fff"
            searchbarFontColor="#fff"
            searchbarFontSize={style.searchBarStyle.searchbarFontSize}
            searchbarHeight={style.searchBarStyle.searchbarHeight}
            spinning={false}
          />
        </SearchbarContainer>
        <SearchbarDescriptionContainer>
          <SearchResultText>
            {extensions.length} results have been retrieved
          </SearchResultText>

          <StyledInput
            style={{
              width: 125,
              fontSize: 11,
              height: 28,
              color: '#888',
            }}
            type="select"
            value={sortTxtDict[sortBy]}
            onChange={(e: any) => {
              const key = _.findKey(
                sortTxtDict,
                (value) => value === e.target.value
              ) as string;
              setSortBy(key);
            }}
          >
            <option>▼ Total download</option>
            <option>▼ Last week download</option>
            <option>▼ Name</option>
            <option>▼ Uploaded time</option>
          </StyledInput>
        </SearchbarDescriptionContainer>
        <ExtensionListOrderedList>
          {_.map(extensions, (extension, idx) => {
            return renderItem(extension, idx);
          })}
        </ExtensionListOrderedList>
      </ExtensionListView>
      <ExtensionDescContainer>
        <TabNavigatorContainer>
          <Tabs
            style={{
              width: '100%',
            }}
          >
            <TabList>
              <Tab>Basic info</Tab>
              <Tab>Web page</Tab>
            </TabList>
            <TabPanel>
              <ExtensionInfoTable
                info={extensions[selectedExtensionIdx]}
                installExtension={installExtension}
                uninstallExtension={uninstallExtension}
                installed={
                  extensionBundleId && selectedExtensionIdx !== -1
                    ? installed.includes(extensionBundleId)
                    : undefined
                }
              />
            </TabPanel>
            <TabPanel
              style={{
                height: '85%',
              }}
            >
              {webviewUrl && (
                <webview
                  id="webview"
                  src={webviewUrl}
                  allowFullScreen={false}
                  style={{
                    marginTop: 16,
                    width: '90%',
                    height: '100%',
                  }}
                />
              )}
              {!webviewUrl && <div>There is no web address</div>}
            </TabPanel>
          </Tabs>
        </TabNavigatorContainer>
      </ExtensionDescContainer>
      <ExtensionListViewFooter>
        <IoMdRefresh
          className="plugin-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => refreshStore()}
        />
      </ExtensionListViewFooter>
    </OuterContainer>
  );
}
