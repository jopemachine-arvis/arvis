/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Core } from 'arvis-core';
import FlatList from 'flatlist-react';
import { ipcRenderer } from 'electron';
import useForceUpdate from 'use-force-update';
import {
  AiOutlineAppstoreAdd,
  AiOutlineEdit,
  AiOutlineBranches,
  AiOutlineDelete,
  AiOutlineExport,
} from 'react-icons/ai';
import { Form, FormGroup, Label } from 'reactstrap';
import path from 'path';
import fse from 'fs-extra';
import { homedir } from 'os';
import { useSelector } from 'react-redux';
import {
  Header,
  OuterContainer,
  PluginDescContainer,
  PluginImg,
  PluginItemContainer,
  PluginItemCreatorText,
  PluginItemTitle,
  PluginListOrderedList,
  PluginListView,
  PluginListViewFooter,
} from './components';
import { StyledInput } from '../../../components';
import { StoreAvailabilityContext } from '../storeAvailabilityContext';
import './index.global.css';
import * as style from './style';
import { IPCMainEnum, IPCRendererEnum } from '../../../ipc/ipcEventEnum';
import { StateType } from '../../../redux/reducers/types';
import { useReserveForceUpdate } from '../../../hooks';

export default function Plugin() {
  const [plugins, setPlugins] = useState<any>({});
  const pluginsRef = useRef<any>();
  const [selectedPluginIdx, setSelectedPluginIdx] = useState<number>(0);
  const selectedPluginIdxRef = useRef<any>();

  const [pluginName, setPluginName] = useState<string>('');
  const [pluginVersion, setPluginVersion] = useState<string>('');
  const [pluginCreator, setPluginCreator] = useState<string>('');
  const [pluginBundleId, setPluginBundleId] = useState<string>('');
  const [pluginCategory, setPluginCategory] = useState<string>('');
  const [pluginDescription, setPluginDescription] = useState<string>('');
  const [pluginWebsite, setPluginWebsite] = useState<string>('');
  const [pluginReadme, setPluginReadme] = useState<string>('');

  const [storeAvailable, setStoreAvailable] = useContext(
    StoreAvailabilityContext
  ) as any;

  const forceUpdate = useForceUpdate();
  const reserveForceUpdate = useReserveForceUpdate();
  const deletePluginEventHandler = useRef<any>();

  const fetchPlugins = () => {
    const pluginsToSet = Core.getPluginList();

    setPlugins(pluginsToSet);
    return null;
  };

  /**
   * @summary
   */
  const ipcCallbackTbl = {
    saveFileRet: (e: Electron.IpcRendererEvent, { file }: { file: any }) => {
      Core.exportPlugin(pluginBundleId, file.filePath);
    },

    openPluginInstallFileDialogRet: (
      e: Electron.IpcRendererEvent,
      fileInfo: any
    ) => {
      if (fileInfo.file.filePaths[0]) {
        setStoreAvailable(false);
        const arvisPluginFilePath = fileInfo.file.filePaths[0];

        Core.installPlugin(arvisPluginFilePath)
          .then(() => {
            fetchPlugins();
            return null;
          })
          .catch((err) => {
            console.error(err);
            ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
              title: 'Installer file is invalid',
              content: err.message,
            });
            setStoreAvailable(true);
          });
      }
    },

    openYesnoDialogRet: (
      e: Electron.IpcRendererEvent,
      { yesPressed }: { yesPressed: boolean }
    ) => {
      if (yesPressed) {
        deletePluginEventHandler.current();
      }
    },

    togglePluginEnabled: (
      e: Electron.IpcRendererEvent,
      { bundleId, enabled }: { bundleId: string; enabled: string }
    ) => {
      // 'setStoreAvailable(true)' is fired in arvis-core when async operations are done.
      setStoreAvailable(false);
      const targetPath = Core.path.getPluginInstalledPath(bundleId);
      fse
        .readJson(targetPath)
        .then(async (json) => {
          json.enabled = !enabled;

          await fse.writeJson(targetPath, json, {
            encoding: 'utf8',
            spaces: 4,
          });

          reserveForceUpdate([1000, 2000, 3000]);
          return null;
        })
        .catch((err) => {
          setStoreAvailable(true);
          console.error(err);
        });
    },
  };

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.saveFileRet, ipcCallbackTbl.saveFileRet);
    ipcRenderer.on(
      IPCMainEnum.openPluginInstallFileDialogRet,
      ipcCallbackTbl.openPluginInstallFileDialogRet
    );
    ipcRenderer.on(
      IPCMainEnum.openYesnoDialogRet,
      ipcCallbackTbl.openYesnoDialogRet
    );
    ipcRenderer.on(
      IPCMainEnum.togglePluginEnabled,
      ipcCallbackTbl.togglePluginEnabled
    );

    return () => {
      ipcRenderer.off(IPCMainEnum.saveFileRet, ipcCallbackTbl.saveFileRet);
      ipcRenderer.off(
        IPCMainEnum.openPluginInstallFileDialogRet,
        ipcCallbackTbl.openPluginInstallFileDialogRet
      );
      ipcRenderer.off(
        IPCMainEnum.openYesnoDialogRet,
        ipcCallbackTbl.openYesnoDialogRet
      );
      ipcRenderer.off(
        IPCMainEnum.togglePluginEnabled,
        ipcCallbackTbl.togglePluginEnabled
      );
    };
  }, []);

  useEffect(() => {
    const pluginBundleIds = Object.keys(plugins);

    if (pluginBundleIds.length) {
      const info = plugins[pluginBundleIds[selectedPluginIdx]];
      const {
        bundleId = '',
        category = '',
        createdby = '',
        description = '',
        name = '',
        version = '',
        webaddress = '',
        readme = '',
      } = info;

      setPluginBundleId(bundleId);
      setPluginCategory(category);
      setPluginCreator(createdby);
      setPluginDescription(description);
      setPluginName(name);
      setPluginVersion(version);
      setPluginWebsite(webaddress);
      setPluginReadme(readme);
    }
  }, [selectedPluginIdx, plugins]);

  const itemClickHandler = (idx: number) => {
    setSelectedPluginIdx(idx);
  };

  const getDefaultIcon = (bundleId: string) => {
    const pluginRootPath = Core.path.getPluginInstalledPath(bundleId);
    const { defaultIcon } = plugins[bundleId];
    const pluginDefaultIconPath = `${pluginRootPath}${path.sep}${defaultIcon}`;

    if (fse.existsSync(pluginDefaultIconPath)) {
      return pluginDefaultIconPath;
    }
    return undefined;
  };

  const pluginItemRightClickHandler = (
    e: React.MouseEvent<HTMLInputElement>,
    bundleId: string
  ) => {
    e.preventDefault();
    const pluginRootPath = Core.path.getPluginInstalledPath(bundleId);
    ipcRenderer.send(IPCRendererEnum.popupPluginItemMenu, {
      pluginPath: pluginRootPath,
      pluginEnabled: plugins[bundleId].enabled,
    });
  };

  const renderItem = (plugin: any, idx: number) => {
    const itemBundleId = plugin.bundleId;
    const info = plugins[itemBundleId];
    if (!info) return <></>;
    const { createdby, name, enabled } = info;

    const applyDisabledStyle = enabled ? {} : style.disabledStyle;
    const pluginItemStyle =
      selectedPluginIdx === idx ? style.selectedItemStyle : {};

    let icon;
    const defaultIconPath = getDefaultIcon(itemBundleId);
    if (defaultIconPath) {
      icon = <PluginImg style={applyDisabledStyle} src={defaultIconPath} />;
    } else {
      icon = (
        <AiOutlineBranches
          style={{ ...applyDisabledStyle, ...style.defaultIconStyle }}
        />
      );
    }

    return (
      <PluginItemContainer
        style={pluginItemStyle}
        key={`pluginItem-${idx}`}
        onClick={() => itemClickHandler(idx)}
        onContextMenu={(e: React.MouseEvent<HTMLInputElement>) => {
          setSelectedPluginIdx(idx);
          const selectedItemBundleId = Object.keys(plugins)[idx];
          console.log('Selected plugin bundleId: ', selectedItemBundleId);
          pluginItemRightClickHandler(e, selectedItemBundleId);
        }}
      >
        {icon}
        <PluginItemTitle style={applyDisabledStyle}>{name}</PluginItemTitle>
        <PluginItemCreatorText style={applyDisabledStyle}>
          {createdby}
        </PluginItemCreatorText>
      </PluginItemContainer>
    );
  };

  const requestAddNewPlugin = () => {
    ipcRenderer.send(IPCRendererEnum.openPluginInstallFileDialog);
  };

  const editPlugin = () => {
    setStoreAvailable(false);
    const targetPath = Core.path.getPluginConfigJsonPath(pluginBundleId);
    fse
      .readJson(targetPath)
      .then(async (json) => {
        json.bundleId = pluginBundleId;
        json.category = pluginCategory;
        json.createdby = pluginCreator;
        json.description = pluginDescription;
        json.name = pluginName;
        json.readme = pluginReadme;
        json.version = pluginVersion;
        json.webaddress = pluginWebsite;

        await fse.writeJson(targetPath, json, { encoding: 'utf8', spaces: 4 });
        reserveForceUpdate([1000, 2000, 3000]);
        return null;
      })
      .catch((err) => {
        setStoreAvailable(true);
        console.error(err);
      });
  };

  const exportPlugin = () => {
    const defaultPath = `${homedir()}${path.sep}Desktop${
      path.sep
    }${pluginBundleId}.arvisplugin`;

    ipcRenderer.send(IPCRendererEnum.saveFile, {
      title: 'Select path to save',
      defaultPath,
    });
  };

  const deleteSelectedPlugin = (pluginList: any, idxToRemove: number) => {
    const pluginBundleIds = Object.keys(pluginList);
    if (!pluginBundleIds.length) return;

    const targetBundleId = pluginList[pluginBundleIds[idxToRemove]].bundleId;

    setStoreAvailable(false);
    Core.uninstallPlugin({
      bundleId: targetBundleId,
    })
      .then(async () => {
        const temp = pluginList;
        delete temp[targetBundleId];
        setPlugins(temp);

        if (idxToRemove !== 0) {
          setSelectedPluginIdx(idxToRemove - 1);
        } else {
          forceUpdate();
        }
        return null;
      })
      .catch((err) => {
        console.error(err);
        setStoreAvailable(true);
      });
  };

  const callDeletePluginConfModal = () => {
    const pluginBundleIds = Object.keys(plugins);
    if (!pluginBundleIds.length) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${pluginBundleId}'?`,
      icon: getDefaultIcon(pluginBundleId),
    });
  };

  useEffect(() => {
    pluginsRef.current = plugins;
    selectedPluginIdxRef.current = selectedPluginIdx;
  });

  useEffect(() => {
    fetchPlugins();
    deletePluginEventHandler.current = () => {
      deleteSelectedPlugin(pluginsRef.current, selectedPluginIdxRef.current);
    };
  }, []);

  return (
    <OuterContainer>
      <PluginListView>
        <Header
          style={{
            marginLeft: 40,
          }}
        >
          Installed Plugins
        </Header>
        <PluginListOrderedList>
          <FlatList
            list={plugins}
            renderItem={renderItem}
            renderWhenEmpty={() => <></>}
          />
        </PluginListOrderedList>
      </PluginListView>
      <PluginDescContainer>
        <Header
          style={{
            marginLeft: 20,
          }}
        >
          Plugin config
        </Header>
        <Form style={style.descriptionContainerStyle}>
          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Name</Label>
            <StyledInput
              type="text"
              placeholder="Name"
              value={pluginName}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginName(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Version</Label>
            <StyledInput
              type="text"
              placeholder="Version"
              value={pluginVersion}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginVersion(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Creator</Label>
            <StyledInput
              type="text"
              placeholder="Creator"
              value={pluginCreator}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginCreator(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Bundle Id</Label>
            <StyledInput
              type="text"
              disabled
              placeholder="Bundle Id"
              value={pluginBundleId}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                // Prevent editing plugin bundle id
                e.preventDefault();
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Category</Label>
            <StyledInput
              type="text"
              placeholder="Category"
              value={pluginCategory}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginCategory(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Description</Label>
            <StyledInput
              type="text"
              placeholder="Description"
              value={pluginDescription}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginDescription(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Read me</Label>
            <StyledInput
              type="textarea"
              placeholder="Read me"
              style={{
                height: 260,
              }}
              value={pluginDescription}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginReadme(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Web site</Label>
            <StyledInput
              type="url"
              placeholder="Web site"
              value={pluginWebsite}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginWebsite(e.currentTarget.value);
              }}
            />
          </FormGroup>
        </Form>
      </PluginDescContainer>

      <PluginListViewFooter>
        <AiOutlineAppstoreAdd
          className="plugin-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => requestAddNewPlugin()}
        />
        <AiOutlineEdit
          className="plugin-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => editPlugin()}
        />
        <AiOutlineExport
          className="plugin-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => exportPlugin()}
        />
        <AiOutlineDelete
          className="plugin-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => callDeletePluginConfModal()}
        />
      </PluginListViewFooter>
    </OuterContainer>
  );
}
