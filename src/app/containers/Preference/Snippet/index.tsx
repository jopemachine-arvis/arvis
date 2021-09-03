/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/catch-or-return */

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import useSnippet from '@hooks/useSnippet';
import './index.css';
import {
  AiOutlineAppstoreAdd,
  AiOutlineBranches,
  AiOutlineDelete,
} from 'react-icons/ai';
import _ from 'lodash';
import { arvisSnippetCollectionPath } from '@config/path';
import path from 'path';
import fse from 'fs-extra';
import { ipcRenderer } from 'electron';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { installSnippet, uninstallSnippet } from '@helper/snippetInstaller';
import { SpinnerContext } from '@helper/spinnerContext';
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
} from './components';

export default function Snippet() {
  const { snippets, snippetCollectionInfos, reloadSnippets } = useSnippet();

  const snippetsByCollection = useMemo(
    () => _.groupBy([...snippets.values()], 'collection'),
    [snippets]
  );

  const [selectedIdx, setSelectedIdx] = useState<number>(-1);

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const selectedCollection = useRef<string>();

  const [collectionEditModalOpened, setCollectionEditModalOpend] =
    useState<boolean>(false);

  selectedCollection.current =
    selectedIdx !== -1
      ? Object.keys(snippetsByCollection)[selectedIdx]
      : undefined;

  const selectedCollectionInfo = selectedCollection.current
    ? snippetCollectionInfos.get(selectedCollection.current)
    : undefined;

  const ipcCallbackTbl = {
    openSnippetInstallFileDialogRet: (
      e: Electron.IpcRendererEvent,
      { file }: { file: any }
    ) => {
      setSpinning(true);

      installSnippet(file.filePaths[0])
        .then(reloadSnippets)
        .catch(console.error)
        .finally(() => {
          setSpinning(false);
        });
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
    const collectionIconPath = path.resolve(
      arvisSnippetCollectionPath,
      collectionName,
      'icon.png'
    );

    if (fse.existsSync(collectionIconPath)) {
      return collectionIconPath;
    }

    return undefined;
  };

  const itemClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    setSelectedIdx(idx);
  };

  const requestAddNewSnippet = () => {
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
        onDoubleClick={() => setCollectionEditModalOpend(true)}
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
        Installed Snippets
      </Header>
      <SnippetListView>
        <SnippetListOrderedList>
          {Object.keys(snippetsByCollection).map((collection, idx) =>
            renderItem(collection, idx)
          )}
        </SnippetListOrderedList>
      </SnippetListView>
      <SnippetSettingContainer>
        {selectedCollection.current && (
          <SnippetTable
            snippets={snippetsByCollection[selectedCollection.current]}
            collectionInfo={selectedCollectionInfo!}
            reloadSnippets={reloadSnippets}
          />
        )}
      </SnippetSettingContainer>

      <SnippetListViewFooter>
        <AiOutlineAppstoreAdd
          className="snippet-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => requestAddNewSnippet()}
        />
        <AiOutlineDelete
          className="snippet-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => callDeleteSnippetConfModal()}
        />
      </SnippetListViewFooter>
      {selectedCollection.current && (
        <CollectionInfoModal
          opened={collectionEditModalOpened}
          setOpened={setCollectionEditModalOpend}
          collection={selectedCollection.current}
          collectionInfo={selectedCollectionInfo}
          reloadSnippets={reloadSnippets}
        />
      )}
    </OuterContainer>
  );
}
