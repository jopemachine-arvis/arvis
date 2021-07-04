/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Core } from 'arvis-core';
import { ipcRenderer } from 'electron';
import useForceUpdate from 'use-force-update';
import {
  AiOutlineAppstoreAdd,
  AiOutlineBranches,
  AiOutlineDelete,
  AiOutlineExport,
} from 'react-icons/ai';
import { constant } from 'arvis-store';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { SearchBar } from '@components/index';
import { useStoreSearchControl } from '@hooks/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import DefaultImg from '../../../../../assets/images/default.svg';
import ExtensionInfoTable from './infoTable';
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
} from './components';
import './index.global.css';
import * as style from './style';

type IProps = {
  allStoreExtensions: any[];
};

export default function Store(props: IProps) {
  const { allStoreExtensions } = props;
  const [extensions, setExtensions] = useState<any[]>([]);

  const [extensionIcons, setExtensionIcons] = useState<any[]>([]);

  const [selectedExtensionIdx, setSelectedExtensionIdx] = useState<number>(-1);

  const [extensionBundleId, setExtensionBundleId] = useState<string>('');
  const [webviewUrl, setWebviewUrl] = useState<string | undefined>('');

  const { setInputStr, getInputProps } = useStoreSearchControl({
    items: extensions,
    originalItems: allStoreExtensions,
    setItems: setExtensions,
  });

  const forceUpdate = useForceUpdate();

  /**
   * @summary
   */
  const ipcCallbackTbl = {};

  const itemClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    setSelectedExtensionIdx(idx);
    forceUpdate();
  };

  useEffect(() => {
    setExtensions(allStoreExtensions);
  }, []);

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
    // open(
    //   path.resolve(
    //     Core.path.getExtensionInstalledPath(pluginBundleIds[idx]),
    //     'arvis-plugin.json'
    //   )
    // );
  };

  const renderItem = (extension: any, idx: number) => {
    if (!extension) return <React.Fragment key={`extensionItem-${idx}`} />;
    const { creator, name, description, dt, type } = extension;
    const bundleId = Core.getBundleId(creator, name);

    const extensionItemStyle =
      selectedExtensionIdx === idx ? style.selectedItemStyle : {};

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
            e.currentTarget.src = DefaultImg;
          }}
        />
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
              <Tab>Web view</Tab>
            </TabList>
            <TabPanel>
              <ExtensionInfoTable info={extensions[selectedExtensionIdx]} />
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
      <ExtensionListViewFooter />
    </OuterContainer>
  );
}
