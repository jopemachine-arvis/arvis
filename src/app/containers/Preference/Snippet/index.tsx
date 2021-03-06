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
import { globalConfigChangeHandler } from '@utils/globalConfigChangeHandler';
import * as style from './style';
import CollectionInfoModal from './collectionInfoModal';
import SnippetInfoModal from './snippetInfoModal';
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

type IProps = {
  snippets: SnippetItem[];
  snippetCollectionInfos: Map<CollectionName, SnippetCollectionInfo>;
  reloadSnippets: () => void;
};

export default function Snippet(props: IProps) {
  const { snippets, snippetCollectionInfos, reloadSnippets } = props;

  const snippetsByCollection = useMemo(
    () => _.groupBy(snippets, 'collection'),
    [snippets]
  );

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const selectedCollection = useRef<CollectionName | undefined>();
  const selectedCollectionInfo = useRef<SnippetCollectionInfo | undefined>();

  const [collectionEditModalOpened, setCollectionEditModalOpened] =
    useState<boolean>(false);

  const [snippetInfoModalOpened, setSnippetInfoModalOpened] =
    useState<boolean>(false);

  const [clickedSnippetIdx, setClickedSnippetIdx] = useState<number>(0);

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

  const itemRightClickCallback = (
    e: React.MouseEvent<HTMLInputElement>,
    clickedIdx: number,
    selectedIdxs: Set<number>
  ) => {
    e.preventDefault();

    const selectedItemInfos = [];

    for (const idx of selectedIdxs) {
      const { title } = items[idx];

      selectedItemInfos.push({
        collectionName: title,
        collectionPath: path.resolve(arvisSnippetCollectionPath, title),
      });
    }

    ipcRenderer.send(IPCRendererEnum.popupSnippetCollectionItemMenu, {
      items: JSON.stringify(selectedItemInfos),
    });
  };

  const { itemList, onKeyDownHandler, selectedItemIdx, clearIndex } =
    useItemList({
      items,
      itemDoubleClickHandler: () => setCollectionEditModalOpened(true),
      itemRightClickCallback,
      itemTooltip:
        'Click to select the snippet collection.\nDouble click to edit collection information.',
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

  const hotkeyChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    globalConfigChangeHandler(
      e,
      GlobalConfigActionTypes.SET_SNIPPET_WINDOW_HOTKEY
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

  const snippetTableDoubleClickHandler = (idx: number) => {
    setClickedSnippetIdx(idx);
    setSnippetInfoModalOpened(true);
  };

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
              style={{
                fontSize: 12,
              }}
            />
          </FormGroup>
        </Form>
        {itemList}
      </SnippetListView>
      <SnippetSettingContainer>
        <SnippetTable
          collectionInfo={selectedCollectionInfo.current}
          reloadSnippets={reloadSnippets}
          snippetTableDoubleClickHandler={snippetTableDoubleClickHandler}
          snippets={
            selectedCollection.current
              ? snippetsByCollection[selectedCollection.current]
              : undefined
          }
        />
      </SnippetSettingContainer>

      <SnippetListViewFooter>
        <AiOutlinePlus
          title="Create new snippet collection"
          className="snippet-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => makeNewCollection()}
        />
        <AiOutlineAppstoreAdd
          title="Install new snippet collection through arvissnippets (or alfredsnippets) file"
          className="snippet-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => requestInstallSnippet()}
        />
        <AiOutlineDelete
          title="Delete selected collection"
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
      <SnippetInfoModal
        snippetInfo={snippets[clickedSnippetIdx]}
        opened={snippetInfoModalOpened}
        setOpened={setSnippetInfoModalOpened}
        reloadSnippets={reloadSnippets}
      />
    </OuterContainer>
  );
}
