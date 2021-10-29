/* eslint-disable promise/no-nesting */
import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { Core } from 'arvis-core';
import { constant, searchMostTotalDownload } from 'arvis-store';
import open from 'open';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { IoMdRefresh } from 'react-icons/io';
import semver from 'semver';
import {
  ExtensionInfoWebview,
  SearchBar,
  StyledInput,
} from '@components/index';
import { useItemList, useStoreSearchControl } from '@hooks/index';
import { SpinnerContext } from '@helper/spinnerContext';
import {
  installExtension,
  uninstallExtension,
} from '@helper/extensionDownloadHandler';
import ExtensionInfoTable from './infoTable';
import ExtensionDefaultImg from '../../../../../assets/images/extensionDefaultIcon.svg';
import {
  Header,
  OuterContainer,
  ExtensionDescContainer,
  SearchbarContainer,
  ExtensionItemContainer,
  ExtensionItemCreatorText,
  ExtensionItemTitle,
  ExtensionListView,
  ExtensionListViewFooter,
  TabNavigatorContainer,
  ExtensionItemDescText,
  ExtensionImg,
  InstallMark,
  SearchResultText,
  SearchbarDescriptionContainer,
} from './components';
import './index.css';
import * as style from './style';

type IProps = {
  allStoreExtensions: any[];
};

const sortTxtDict: Record<string, string> = {
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
  const [extensionBundleId, setExtensionBundleId] = useState<string>('');
  const [webviewUrl, setWebviewUrl] = useState<string | undefined>('');

  const { getInputProps } = useStoreSearchControl({
    items: extensions,
    originalItems: allExtensions,
    setItems: setExtensions,
  });

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const [sortBy, setSortBy] = useState<string>('dt');

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

  const itemDoubleClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    open(extensions[idx].webAddress);
  };

  const renderItem = (
    extension: any,
    idx: number,
    selectedExtensionIdx: number,
    selectedIdxs: Set<number>,
    defaultItemClickHandler: any
  ) => {
    if (!extension) return <React.Fragment key={`extensionItem-${idx}`} />;
    const { creator, name, description, type, latest } = extension;
    const bundleId = Core.getBundleId(creator, name);

    const itemContainerStyle = selectedIdxs.has(idx)
      ? style.selectedItemStyle
      : {};

    const installedExtensionInfo: any | undefined =
      type === 'workflow'
        ? Core.getWorkflowList()[bundleId]
        : Core.getPluginList()[bundleId];

    const currentVersion = installedExtensionInfo
      ? installedExtensionInfo.version
      : undefined;

    return (
      <ExtensionItemContainer
        style={itemContainerStyle}
        key={`extensionItem-${idx}`}
        onClick={(e) => defaultItemClickHandler(e, idx)}
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
        <ExtensionItemCreatorText>{creator}</ExtensionItemCreatorText>
        <ExtensionItemDescText>{description}</ExtensionItemDescText>
      </ExtensionItemContainer>
    );
  };

  const { itemList, onKeyDownHandler, selectedItemIdx } = useItemList({
    items: extensions,
    renderItem,
  });

  useEffect(() => {
    setExtensions(allStoreExtensions);
  }, [allStoreExtensions]);

  useEffect(() => {
    sortExtensions();
  }, [sortBy]);

  useEffect(() => {
    if (extensions.length) {
      const info = selectedItemIdx === -1 ? {} : extensions[selectedItemIdx];

      if (!info) return;

      const { creator = '', name = '', webAddress = '' } = info;

      const bundleId =
        selectedItemIdx === -1 ? '' : Core.getBundleId(creator, name);

      setExtensionBundleId(bundleId);
      setWebviewUrl(webAddress);
    }
  }, [selectedItemIdx, extensions]);

  return (
    <OuterContainer
      id="extension-page-container"
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
    >
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
            getInputProps={getInputProps}
            hasBorder
            hasContextMenu={false}
            hasDragger={false}
            hasSearchIcon
            isPinned={false}
            itemLeftPadding={style.searchBarStyle.itemLeftPadding}
            placeholder="Search arvis extensions"
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
              userSelect: 'none',
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
            {Object.values(sortTxtDict).map(
              (optionStr: string, idx: number) => (
                <option key={`option-${idx}`}>{optionStr}</option>
              )
            )}
          </StyledInput>
        </SearchbarDescriptionContainer>
        {itemList}
      </ExtensionListView>
      <ExtensionDescContainer>
        <TabNavigatorContainer>
          <Tabs
            style={{
              width: '100%',
              userSelect: 'none',
            }}
          >
            <TabList>
              <Tab>Basic info</Tab>
              <Tab>Web page</Tab>
            </TabList>
            <TabPanel>
              <ExtensionInfoTable
                info={extensions[selectedItemIdx]}
                installExtension={installExtension}
                uninstallExtension={uninstallExtension}
                installed={
                  extensionBundleId && selectedItemIdx !== -1
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
              <ExtensionInfoWebview url={webviewUrl} />
            </TabPanel>
          </Tabs>
        </TabNavigatorContainer>
      </ExtensionDescContainer>
      <ExtensionListViewFooter>
        <IoMdRefresh
          title="Refresh store items"
          className="extension-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => refreshStore()}
        />
      </ExtensionListViewFooter>
    </OuterContainer>
  );
}
