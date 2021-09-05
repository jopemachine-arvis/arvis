/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/catch-or-return */

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
import { createGlobalConfigChangeHandler } from '@utils/createGlobalConfigChangeHandler';
import * as style from './style';
import CollectionInfoModal from './collectionInfoModal';
import SnippetTable from './snippetTable';
import {
  OuterContainer,
  SnippetListOrderedList,
  SnippetListViewFooter,
  SnippetSettingContainer,
  Header,
  SnippetListView,
  SnippetItemContainer,
  SnippetImg,
  SnippetItemTitle,
  SnippetItemSubText,
  EmptyItemContainer,
} from './components';
import './index.css';

export default function Snippet(props: any) {
  const { snippets, snippetCollectionInfos, reloadSnippets } = props;

  const snippetsByCollection = useMemo(
    () => _.groupBy(snippets, 'collection'),
    [snippets]
  );

  const [selectedIdx, setSelectedIdx] = useState<number>(-1);

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

  useEffect(() => {
    selectedCollection.current =
      selectedIdx !== -1
        ? Object.keys(snippetsByCollection)[selectedIdx]
        : undefined;

    selectedCollectionInfo.current = selectedCollection.current
      ? snippetCollectionInfos.get(selectedCollection.current)
      : undefined;

    forceUpdate();
  }, [selectedIdx, snippetsByCollection]);

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

  const itemClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    setSelectedIdx(idx);
  };

  const makeNewCollection = () => {
    setSelectedIdx(-1);
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

  const renderItem = (collectionName: string, idx: number) => {
    let icon;
    const defaultIconPath = getDefaultIcon(collectionName);

    if (defaultIconPath) {
      icon = <SnippetImg src={defaultIconPath} />;
    } else {
      icon = <AiOutlineBranches style={style.defaultIconStyle} />;
    }

    return (
      <SnippetItemContainer
        key={`snippetItem-${idx}`}
        onClick={(e) => itemClickHandler(e, idx)}
        onDoubleClick={() => setCollectionEditModalOpened(true)}
        style={selectedIdx === idx ? style.selectedItemStyle : {}}
      >
        {icon}
        <SnippetItemTitle>{collectionName}</SnippetItemTitle>
        <SnippetItemSubText>
          {`${snippetsByCollection[collectionName].length} Snippets`}
        </SnippetItemSubText>
      </SnippetItemContainer>
    );
  };

  const configChangeHandler = createGlobalConfigChangeHandler({
    destWindows: ['searchWindow', 'preferenceWindow'],
    dispatch,
  });

  const hotkeyChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    configChangeHandler(e, GlobalConfigActionTypes.SET_SNIPPET_WINDOW_HOTKEY);
  };

  const renderSnippetItems = () => {
    if (Object.keys(snippetsByCollection).length === 0) {
      return (
        <EmptyItemContainer>
          <SnippetItemContainer>List is empty!</SnippetItemContainer>
        </EmptyItemContainer>
      );
    }

    return Object.keys(snippetsByCollection).map((collection, idx) =>
      renderItem(collection, idx)
    );
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
    <OuterContainer id="snippet-page-container" tabIndex={0}>
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
              hotkey={snippet_window_hotkey}
              onHotkeyChange={hotkeyChangeHandler}
            />
          </FormGroup>
        </Form>

        <SnippetListOrderedList>{renderSnippetItems()}</SnippetListOrderedList>
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
