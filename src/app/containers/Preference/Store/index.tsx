/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Core } from 'arvis-core';
import { ipcRenderer } from 'electron';
import useForceUpdate from 'use-force-update';
import { api, searchMostTotalDownload } from 'arvis-store';
import {
  AiOutlineAppstoreAdd,
  AiOutlineBranches,
  AiOutlineDelete,
  AiOutlineExport,
} from 'react-icons/ai';
import { Form, FormGroup, Label } from 'reactstrap';
import { SearchBar, StyledInput } from '@components/index';
import { useStoreSearchControl } from '@hooks/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { StoreAvailabilityContext } from '@helper/storeAvailabilityContext';
import {
  Header,
  OuterContainer,
  ExtensionDescContainer,
  SearchbarContainer,
  ExtensionItemDescText,
  ExtensionImg,
  ExtensionItemContainer,
  ExtensionItemCreatorText,
  ExtensionItemDownloadCntText,
  ExtensionItemTitle,
  ExtensionListOrderedList,
  ExtensionListView,
  ExtensionListViewFooter,
} from './components';
import './index.global.css';
import * as style from './style';

export default function Store() {
  const [extensions, setExtensions] = useState<any[]>([]);
  const [extensionIcons, setExtensionIcons] = useState<any[]>([]);

  const [selectedExtensionIdx, setSelectedExtensionIdx] = useState<number>(-1);
  const selectedExtensionIdxRef = useRef<any>();

  const [extensionBundleId, setExtensionBundleId] = useState<string>('');
  const [extensionCategory, setExtensionCategory] = useState<string>('');
  const [extensionCreator, setExtensionCreator] = useState<string>('');
  const [extensionDescription, setExtensionDescription] = useState<string>('');
  const [extensionName, setExtensionName] = useState<string>('');
  const [extensionReadme, setExtensionReadme] = useState<string>('');
  const [extensionVersion, setExtensionVersion] = useState<string>('');
  const [extensionWebsite, setExtensionWebsite] = useState<string>('');

  const [webviewUrl, setWebviewUrl] = useState<string | undefined>('');

  const {
    indexInfo,
    clearIndexInfo,
    setInputStr,
    onDoubleClickHandler,
    onWheelHandler,
    getInputProps,
  } = useStoreSearchControl({
    items: extensions,
    originalItems: extensions,
    setItems: setExtensions,
    maxShowOnScreen: 10,
  });

  const [storeAvailable, setStoreAvailable] = useContext(
    StoreAvailabilityContext
  ) as any;

  const forceUpdate = useForceUpdate();

  /**
   * @summary
   */
  const ipcCallbackTbl = {};

  useEffect(() => {
    searchMostTotalDownload()
      .then((extensionInfos) => {
        setExtensions(extensionInfos);
        return null;
      })
      .catch(console.error);
    return () => {};
  }, []);

  const itemClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    setSelectedExtensionIdx(idx);

    forceUpdate();
  };

  useEffect(() => {
    if (extensions.length) {
      const info =
        selectedExtensionIdx === -1 ? {} : extensions[selectedExtensionIdx];

      const {
        creator = '',
        description = '',
        name = '',
        webAddress = '',
      } = info;

      const bundleId =
        selectedExtensionIdx === -1 ? '' : Core.getBundleId(creator, name);

      setExtensionBundleId(bundleId);
      setExtensionCreator(creator);
      setExtensionDescription(description);
      setExtensionName(name);
      setExtensionWebsite(webAddress);

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
    // const itemBundleId = Core.getBundleId(extension.creator, extension.name) as string;
    if (!extension) return <React.Fragment key={`pluginItem-${idx}`} />;
    const { creator, name, uploaded, dt, dw } = extension;

    const extensionItemStyle =
      selectedExtensionIdx === idx ? style.selectedItemStyle : {};

    return (
      <ExtensionItemContainer
        style={extensionItemStyle}
        key={`extensionItem-${idx}`}
        onClick={(e) => itemClickHandler(e, idx)}
        onDoubleClick={(e) => itemDoubleClickHandler(e, idx)}
      >
        <ExtensionItemTitle>{name}</ExtensionItemTitle>
        <ExtensionItemCreatorText>{`${creator}`}</ExtensionItemCreatorText>
        <ExtensionItemCreatorText>
          {`${new Date(uploaded).toLocaleString()}`}
        </ExtensionItemCreatorText>
        <ExtensionItemDownloadCntText>
          {`Total downloads: ${dt}`}
        </ExtensionItemDownloadCntText>
        {/* <ExtensionItemDownloadCntText>
          {`Weekly downloads: ${dw}`}
        </ExtensionItemDownloadCntText> */}
      </ExtensionItemContainer>
    );
  };

  useEffect(() => {
    Core.Store.onStoreUpdate = () => {
      forceUpdate();
    };
  }, []);

  return (
    <OuterContainer id="extension-page-container" tabIndex={0}>
      <Header
        style={{
          marginLeft: 40,
        }}
      >
        Store
      </Header>
      <ExtensionListView
        onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
          onWheelHandler(e);
        }}
      >
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
        <webview
          id="webview"
          src={webviewUrl}
          allowFullScreen={false}
          style={{
            width: '90%',
            height: '85%',
          }}
        />
        {/* <Form style={style.descriptionContainerStyle}>
          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Name</Label>
            <StyledInput
              disabled
              type="text"
              placeholder="Name"
              value={extensionName}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Creator</Label>
            <StyledInput
              disabled
              type="text"
              placeholder="Creator"
              value={extensionCreator}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Version</Label>
            <StyledInput
              disabled
              type="text"
              placeholder="Version"
              value={extensionVersion}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Category</Label>
            <StyledInput
              disabled
              type="text"
              placeholder="Category"
              value={extensionCategory}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Description</Label>
            <StyledInput
              disabled
              type="text"
              placeholder="Description"
              value={extensionDescription}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Read Me</Label>
            <StyledInput
              disabled
              type="textarea"
              className="extension-page-textarea"
              placeholder="README"
              style={{
                height: 260,
              }}
              value={extensionReadme}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Web Site</Label>
            <StyledInput
              disabled
              type="url"
              placeholder="Web Site"
              value={extensionWebsite}
            />
          </FormGroup>
            </Form> */}
      </ExtensionDescContainer>

      <ExtensionListViewFooter />
    </OuterContainer>
  );
}
