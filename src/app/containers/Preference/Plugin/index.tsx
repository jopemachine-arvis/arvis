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
  const plugins = Core.getPluginList();
  const pluginBundleIds = Object.keys(plugins).sort((a, b) => {
    return Core.getNameFromBundleId(a).toLowerCase() <
      Core.getNameFromBundleId(b).toLowerCase()
      ? -1
      : 1;
  });

  const pluginBundleIdsRef = useRef<any>(pluginBundleIds);
  const [selectedPluginIdx, setSelectedPluginIdx] = useState<number>(-1);
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

  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set([]));

  const forceUpdate = useForceUpdate();
  const deletePluginEventHandler = useRef<any>();

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

    togglePluginsEnabled: (
      e: Electron.IpcRendererEvent,
      { bundleIds, enabled }: { bundleIds: string; enabled: string }
    ) => {
      setStoreAvailable(false);
      const bundleIdList = JSON.parse(bundleIds) as string[];
      const works: Promise<any>[] = [];

      ipcRenderer.send(IPCRendererEnum.stopFileWatch);
      for (const bundleId of bundleIdList) {
        const targetPath = Core.path.getPluginConfigJsonPath(bundleId);
        const targetJson = Core.getPluginList()[bundleId];

        targetJson.enabled = !enabled;

        works.push(
          fse.writeJson(targetPath, targetJson, {
            encoding: 'utf8',
            spaces: 4,
          })
        );
      }

      Promise.all(works)
        .then(async () => {
          ipcRenderer.send(IPCRendererEnum.resumeFileWatch);
          ipcRenderer.send(IPCRendererEnum.renewPlugin);
          setStoreAvailable(true);
          return null;
        })
        .catch((err) => {
          console.error(err);
          setStoreAvailable(true);
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
      IPCMainEnum.togglePluginsEnabled,
      ipcCallbackTbl.togglePluginsEnabled
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
        IPCMainEnum.togglePluginsEnabled,
        ipcCallbackTbl.togglePluginsEnabled
      );
    };
  }, []);

  useEffect(() => {
    if (pluginBundleIds.length) {
      const info =
        selectedPluginIdx === -1
          ? {}
          : plugins[pluginBundleIds[selectedPluginIdx]];

      const {
        category = '',
        createdby = '',
        description = '',
        name = '',
        readme = '',
        version = '',
        webaddress = '',
      } = info;

      const bundleId =
        selectedPluginIdx === -1 ? '' : Core.getBundleId(createdby, name);

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
      const bundleId = pluginBundleIds[idx];
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
    if (selectedPluginIdx === -1) return;
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
    if (selectedPluginIdx === -1) return;

    const defaultPath = path.resolve(
      homedir(),
      'Desktop',
      `${pluginBundleId}.arvisplugin`
    );

    ipcRenderer.send(IPCRendererEnum.saveFile, {
      title: 'Select path to save',
      defaultPath,
    });
  };

  const deleteSelectedPlugin = (_pluginBundleIds: any, idxToRemove: number) => {
    if (!_pluginBundleIds.length) return;

    const targetBundleId = _pluginBundleIds[idxToRemove];

    setStoreAvailable(false);
    Core.uninstallPlugin({
      bundleId: targetBundleId,
    })
      .then(async () => {
        ipcRenderer.send(IPCRendererEnum.renewPlugin);

        if (idxToRemove !== 0) {
          setSelectedPluginIdx(-1);
          setSelectedIdxs(new Set());
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
    if (selectedPluginIdx === -1) return;
    if (!pluginBundleIds.length) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${pluginBundleId}'?`,
      icon: getDefaultIcon(pluginBundleId),
    });
  };

  useEffect(() => {
    pluginBundleIdsRef.current = pluginBundleIds;
    selectedPluginIdxRef.current = selectedPluginIdx;
  });

  useEffect(() => {
    Core.Store.onStoreUpdate = () => {
      forceUpdate();
    };

    deletePluginEventHandler.current = () => {
      deleteSelectedPlugin(
        pluginBundleIdsRef.current,
        selectedPluginIdxRef.current
      );
    };
  }, []);

  return (
    <OuterContainer>
      <Header
        style={{
          marginLeft: 40,
        }}
      >
        Installed Plugins
      </Header>
      <PluginListView>
        <PluginListOrderedList>
          {_.map(Object.keys(plugins), (plugin, idx) => {
            return renderItem(plugins[plugin], idx);
          })}
        </PluginListOrderedList>
      </PluginListView>
      <PluginDescContainer>
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
              placeholder="README"
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
