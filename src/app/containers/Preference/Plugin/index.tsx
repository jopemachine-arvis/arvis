/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Core } from '@jopemachine/arvis-core';
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
import { StyledInput } from '@components/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { StoreAvailabilityContext } from '@helper/storeAvailabilityContext';
import { isWithCtrlOrCmd, range } from '@utils/index';
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
import './index.global.css';
import * as style from './style';

export default function Plugin() {
  const [plugins, setPlugins] = useState<any>({});
  const pluginsRef = useRef<any>();
  const [selectedPluginIdx, setSelectedPluginIdx] = useState<number>(0);
  const selectedPluginIdxRef = useRef<any>();

  const [pluginBundleId, setPluginBundleId] = useState<string>('');
  const [pluginCategory, setPluginCategory] = useState<string>('');
  const [pluginCreator, setPluginCreator] = useState<string>('');
  const [pluginDescription, setPluginDescription] = useState<string>('');
  const [pluginName, setPluginName] = useState<string>('');
  const [pluginReadme, setPluginReadme] = useState<string>('');
  const [pluginVersion, setPluginVersion] = useState<string>('');
  const [pluginWebsite, setPluginWebsite] = useState<string>('');

  const [storeAvailable, setStoreAvailable] = useContext(
    StoreAvailabilityContext
  ) as any;

  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(
    new Set([selectedPluginIdx])
  );

  const forceUpdate = useForceUpdate();
  const deletePluginEventHandler = useRef<any>();

  const fetchPlugins = () => {
    // Set plugins object to Core's plugin list.
    // If there is any update, Automatically updates from Core
    setPlugins(Core.getPluginList());
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
      { file }: { file: any }
    ) => {
      if (file.filePaths[0]) {
        setStoreAvailable(false);
        const arvisPluginFilePath = file.filePaths[0];

        Core.installPlugin(arvisPluginFilePath)
          .then(() => {
            fetchPlugins();

            ipcRenderer.send(IPCRendererEnum.renewPlugin, {
              destWindow: 'searchWindow',
            });

            return null;
          })
          .catch((err) => {
            console.error(err);
            ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
              title: 'Installer file is invalid',
              content: err.message,
            });
          })
          .finally(() => {
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
      setStoreAvailable(false);
      const targetPath = Core.path.getPluginConfigJsonPath(bundleId);
      fse
        .readJson(targetPath)
        .then(async (json) => {
          json.enabled = !enabled;

          await fse.writeJson(targetPath, json, {
            encoding: 'utf8',
            spaces: 4,
          });

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
        category = '',
        createdby = '',
        description = '',
        name = '',
        readme = '',
        version = '',
        webaddress = '',
      } = info;

      const bundleId = Core.getBundleId(createdby, name);

      setPluginBundleId(bundleId);
      setPluginCategory(category);
      setPluginCreator(createdby);
      setPluginDescription(description);
      setPluginName(name);
      setPluginReadme(readme);
      setPluginVersion(version);
      setPluginWebsite(webaddress);
    }
  }, [selectedPluginIdx, plugins]);

  const itemClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    const swap = new Set(selectedIdxs);
    if (e.shiftKey) {
      const from = selectedPluginIdx > idx ? idx : selectedPluginIdx;
      const to = selectedPluginIdx < idx ? idx : selectedPluginIdx;
      setSelectedIdxs(new Set(range(from, to, 1)));
    } else if (
      isWithCtrlOrCmd({ isWithCmd: e.metaKey, isWithCtrl: e.ctrlKey })
    ) {
      if (selectedIdxs.has(idx)) {
        swap.delete(idx);
      } else {
        swap.add(idx);
      }
      setSelectedIdxs(swap);
    } else {
      setSelectedIdxs(new Set([idx]));
      setSelectedPluginIdx(idx);
    }
    forceUpdate();
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
    clickedIdx: number
  ) => {
    e.preventDefault();
    let targetIdxs;

    if (selectedIdxs.has(clickedIdx)) {
      targetIdxs = new Set(selectedIdxs);
      targetIdxs.add(clickedIdx);
    } else {
      targetIdxs = new Set([clickedIdx]);
    }

    setSelectedIdxs(targetIdxs);
    const selectedItemInfos = [];

    for (const idx of targetIdxs) {
      const bundleId = Object.keys(plugins)[idx];
      selectedItemInfos.push({
        pluginPath: Core.path.getPluginInstalledPath(bundleId),
        pluginEnabled: plugins[bundleId].enabled,
      });
    }

    ipcRenderer.send(IPCRendererEnum.popupPluginItemMenu, {
      items: JSON.stringify(selectedItemInfos),
    });

    forceUpdate();
  };

  const renderItem = (plugin: any, idx: number) => {
    const itemBundleId = plugin.bundleId;
    const info = plugins[itemBundleId];
    if (!info) return <React.Fragment key={`pluginItem-${idx}`} />;
    const { createdby, name, enabled } = info;

    const applyDisabledStyle = enabled ? {} : style.disabledStyle;
    const pluginItemStyle = selectedIdxs.has(idx)
      ? style.selectedItemStyle
      : {};

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
        onClick={(e) => itemClickHandler(e, idx)}
        onContextMenu={(e: React.MouseEvent<HTMLInputElement>) => {
          pluginItemRightClickHandler(e, idx);
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
        json.category = pluginCategory;
        json.description = pluginDescription;
        json.readme = pluginReadme;
        json.version = pluginVersion;
        json.webaddress = pluginWebsite;

        await fse.writeJson(targetPath, json, { encoding: 'utf8', spaces: 4 });
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

        ipcRenderer.send(IPCRendererEnum.renewPlugin, {
          destWindow: 'searchWindow',
        });

        if (idxToRemove !== 0) {
          setSelectedPluginIdx(idxToRemove - 1);
        } else {
          forceUpdate();
        }
        return null;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
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
    Core.Store.onStoreUpdate = () => {
      forceUpdate();
    };

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
          {_.map(Object.keys(plugins), (plugin, idx) => {
            return renderItem(plugins[plugin], idx);
          })}
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
              disabled
              type="text"
              placeholder="Name"
              value={pluginName}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginName(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Creator</Label>
            <StyledInput
              disabled
              type="text"
              placeholder="Creator"
              value={pluginCreator}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginCreator(e.currentTarget.value);
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
            <Label style={style.labelStyle}>Read Me</Label>
            <StyledInput
              type="textarea"
              className="plugin-page-textarea"
              placeholder="Read Me"
              style={{
                height: 260,
              }}
              value={pluginReadme}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setPluginReadme(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Web Site</Label>
            <StyledInput
              type="url"
              placeholder="Web Site"
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
