/* eslint-disable @typescript-eslint/naming-convention */

import React, { useEffect, useMemo, useState } from 'react';
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
import { installSnippet } from '@helper/installSnippet';
import * as style from './style';
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

  const selectedCollection =
    selectedIdx !== -1
      ? Object.keys(snippetsByCollection)[selectedIdx]
      : undefined;

  const ipcCallbackTbl = {
    openSnippetInstallFileDialogRet: (
      e: Electron.IpcRendererEvent,
      { file }: { file: any }
    ) => {
      console.log('Open installer file: ', file);

      installSnippet(file.filePaths[0]);
    },

    openYesnoDialogRet: (
      e: Electron.IpcRendererEvent,
      { yesPressed }: { yesPressed: boolean }
    ) => {
      if (yesPressed) {
        //
      }
    },
  };

  const getDefaultIcon = (collectionName: string) => {
    const collectionPath = path.resolve(
      arvisSnippetCollectionPath,
      collectionName
    );
    const collectionIconPath = path.resolve(collectionPath, 'icon.png');
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
    if (!selectedCollection) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${selectedCollection}'?`,
      icon: getDefaultIcon(selectedCollection),
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
        {selectedCollection && (
          <SnippetTable
            snippets={snippetsByCollection[selectedCollection]}
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
    </OuterContainer>
  );
}
