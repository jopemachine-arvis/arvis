/* eslint-disable @typescript-eslint/naming-convention */

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AiOutlineAppstoreAdd,
  AiOutlineBranches,
  AiOutlineDelete,
  AiOutlinePlus,
} from 'react-icons/ai';
import _ from 'lodash';
import { arvisSnippetCollectionPath } from '@config/path';
import path from 'path';
import { ipcRenderer } from 'electron';
import useForceUpdate from 'use-force-update';
import { Form, FormGroup, Label } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { installSnippet, uninstallSnippet } from '@helper/snippetInstaller';
import { SpinnerContext } from '@helper/spinnerContext';
import { actionTypes as GlobalConfigActionTypes } from '@redux/actions/globalConfig';
import HotkeyRecordForm from '@components/hotkeyRecordForm';
import { StateType } from '@redux/reducers/types';
import useItemList, { ItemInfo } from '@hooks/useItemList';
import { createGlobalConfigChangeHandler } from '@utils/createGlobalConfigChangeHandler';
import * as style from './style';
import CollectionInfoModal from './collectionInfoModal';
import SnippetTable from './snippetTable';
import {
  OuterContainer,
  SnippetListViewFooter,
  SnippetSettingContainer,
  Header,
  SnippetListView,
  SnippetImg,
} from './components';
import './index.css';

export default function Snippet(props: any) {
  const { snippets, snippetCollectionInfos, reloadSnippets } = props;

  const snippetsByCollection = useMemo(
    () => _.groupBy(snippets, 'collection'),
    [snippets]
  );

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const selectedCollection = useRef<string | undefined>();
  const selectedCollectionInfo = useRef<SnippetCollectionInfo | undefined>();

  const [collectionEditModalOpened, setCollectionEditModalOpened] =
    useState<boolean>(false);

  const forceUpdate = useForceUpdate();

  const { snippet_window_hotkey } = useSelector(
    (state: StateType) => state.global_config
  );

  const dispatch = useDispatch();

  const ipcCallbackTbl = {
    openSnippetInstallFileDialogRet: (
      e: Electron.IpcRendererEvent,
      { file }: { file: any }
    ) => {
      if (file.filePaths[0]) {
        setSpinning(true);

        installSnippet(file.filePaths[0])
          .then(reloadSnippets)
          .catch(console.error)
          .finally(() => {
            setSpinning(false);
          });
      }
    },

    openYesnoDialogRet: (
      e: Electron.IpcRendererEvent,
      { yesPressed }: { yesPressed: boolean }
    ) => {
      if (yesPressed) {
        setSpinning(true);
        uninstallSnippet(selectedCollection.current!)
          .then(reloadSnippets)
          .catch(console.error)
          .finally(() => {
            setSpinning(false);
          });
      }
    },
  };

  const getDefaultIcon = (collectionName: string) => {
    if (
      snippetCollectionInfos.get(collectionName) &&
      snippetCollectionInfos.get(collectionName)!.hasIcon
    ) {
      return path.resolve(
        arvisSnippetCollectionPath,
        collectionName,
        'icon.png'
      );
    }

    return undefined;
  };

  const makeItem = (collectionName: string): ItemInfo => {
    let icon;
    const defaultIconPath = getDefaultIcon(collectionName);
    if (defaultIconPath) {
      icon = <SnippetImg src={defaultIconPath} />;
    } else {
      icon = <AiOutlineBranches style={style.defaultIconStyle} />;
    }

    return {
      icon,
      enabled: true,
      title: collectionName,
      subtitle: `${snippetsByCollection[collectionName].length} Snippets`,
    };
  };

  const items = _.map(Object.keys(snippetsByCollection), makeItem);

  const { itemList, onKeyDownHandler, selectedItemIdx, clearIndex } =
    useItemList({
      items,
      itemDoubleClickHandler: () => setCollectionEditModalOpened(true),
      itemRightClickCallback: () => {},
    });

  useEffect(() => {
    selectedCollection.current =
      selectedItemIdx !== -1
        ? Object.keys(snippetsByCollection)[selectedItemIdx]
        : undefined;

    selectedCollectionInfo.current = selectedCollection.current
      ? snippetCollectionInfos.get(selectedCollection.current)
      : undefined;

    forceUpdate();
  }, [selectedItemIdx, snippetsByCollection]);

  const makeNewCollection = () => {
    clearIndex();
    setCollectionEditModalOpened(true);
  };

  const requestInstallSnippet = () => {
    ipcRenderer.send(IPCRendererEnum.openSnippetInstallFileDialog);
  };

  const callDeleteSnippetConfModal = () => {
    if (!selectedCollection.current) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${selectedCollection.current}'?`,
      icon: getDefaultIcon(selectedCollection.current),
    });
  };

  const configChangeHandler = createGlobalConfigChangeHandler({
    destWindows: ['searchWindow', 'preferenceWindow'],
    dispatch,
  });

  const hotkeyChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    configChangeHandler(e, GlobalConfigActionTypes.SET_SNIPPET_WINDOW_HOTKEY);
  };

  useEffect(() => {
    ipcRenderer.on(
      IPCMainEnum.openSnippetInstallFileDialogRet,
      ipcCallbackTbl.openSnippetInstallFileDialogRet
    );

    ipcRenderer.on(
      IPCMainEnum.openYesnoDialogRet,
      ipcCallbackTbl.openYesnoDialogRet
    );

    return () => {
      ipcRenderer.off(
        IPCMainEnum.openSnippetInstallFileDialogRet,
        ipcCallbackTbl.openSnippetInstallFileDialogRet
      );

      ipcRenderer.off(
        IPCMainEnum.openYesnoDialogRet,
        ipcCallbackTbl.openYesnoDialogRet
      );
    };
  }, []);

  return (
    <OuterContainer
      id="snippet-page-container"
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
    >
      <Header
        style={{
          marginLeft: 40,
        }}
      >
        Installed Snippet Collection
      </Header>

      <SnippetListView>
        <Form>
          <FormGroup check style={style.formGroupStyle}>
            <Label checked style={style.labelStyle}>
              Viewer hotkey
            </Label>
            <HotkeyRecordForm
              canBeEmpty
              hotkey={snippet_window_hotkey}
              onHotkeyChange={hotkeyChangeHandler}
            />
          </FormGroup>
        </Form>

        {itemList}
      </SnippetListView>
      <SnippetSettingContainer>
        <SnippetTable
          snippets={
            selectedCollection.current
              ? snippetsByCollection[selectedCollection.current]
              : undefined
          }
          collectionInfo={selectedCollectionInfo.current}
          reloadSnippets={reloadSnippets}
        />
      </SnippetSettingContainer>

      <SnippetListViewFooter>
        <AiOutlinePlus
          className="snippet-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => makeNewCollection()}
        />
        <AiOutlineAppstoreAdd
          className="snippet-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => requestInstallSnippet()}
        />
        <AiOutlineDelete
          className="snippet-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => callDeleteSnippetConfModal()}
        />
      </SnippetListViewFooter>
      <CollectionInfoModal
        opened={collectionEditModalOpened}
        setOpened={setCollectionEditModalOpened}
        collection={selectedCollection.current}
        collectionInfo={selectedCollectionInfo.current}
        reloadSnippets={reloadSnippets}
      />
    </OuterContainer>
  );
}
