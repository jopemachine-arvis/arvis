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
import {
  AiOutlineAppstoreAdd,
  AiOutlineBranches,
  AiOutlineDelete,
} from 'react-icons/ai';
import path from 'path';
import fse from 'fs-extra';
import alphaSort from 'alpha-sort';
import open from 'open';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { JsonEditor } from 'jsoneditor-react';
import { useExtensionSearchControl } from '@hooks/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SpinnerContext } from '@helper/spinnerContext';
import { SearchBar } from '@components/index';
import { isWithCtrlOrCmd, range } from '@utils/index';
import PluginInfoTable from './infoTable';
import ReadMeTable from './readme';
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
  SearchbarContainer,
  TabNavigatorContainer,
} from './components';
import './index.global.css';
import * as style from './style';

export default function Plugin() {
  const plugins = Core.getPluginList();
  const allPluginBundleIds = Object.keys(plugins).sort((a, b) =>
    alphaSort({
      natural: true,
      caseInsensitive: true,
    })(Core.getNameFromBundleId(a), Core.getNameFromBundleId(b))
  );

  const [pluginBundleIds, setPluginBundleIds] =
    useState<string[]>(allPluginBundleIds);
  const pluginBundleIdsRef = useRef<any>(pluginBundleIds);
  const [selectedPluginIdx, setSelectedPluginIdx] = useState<number>(-1);
  const selectedPluginIdxRef = useRef<any>();

  const [pluginBundleId, setPluginBundleId] = useState<string>('');
  const pluginBundleIdRef = useRef<string>(pluginBundleId);

  const [webviewUrl, setWebviewUrl] = useState<string>('');

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set([]));

  const forceUpdate = useForceUpdate();
  const deletePluginEventHandler = useRef<any>();

  const variableTblRef = useRef<any>();

  const setVariableTblRef = (instance: any) => {
    if (instance) {
      variableTblRef.current = instance.jsonEditor;
    } else {
      variableTblRef.current = null;
    }
  };

  const { getInputProps } = useExtensionSearchControl({
    items: pluginBundleIds,
    originalItems: allPluginBundleIds,
    setItems: setPluginBundleIds,
    extensionInfos: plugins,
  });

  const getVariableTbl = (bundleId: string) => {
    if (!plugins[bundleId]) return {};
    return plugins[bundleId].variables ? plugins[bundleId].variables : {};
  };

  const variableTblChangeHandler = (e: any) => {
    if (!pluginBundleId || _.isNil(variableTblRef.current)) return;
    if (!e.target || !e.target.classList) return;

    if (
      !e.target.classList.contains('jsoneditor-field') &&
      !e.target.classList.contains('jsoneditor-value') &&
      !e.target.classList.contains('jsoneditor-remove')
    )
      return;

    if (
      !_.isEqual(
        plugins[pluginBundleIdRef.current].variables,
        variableTblRef.current.get()
      )
    ) {
      fse
        .writeJSON(
          Core.path.getPluginConfigJsonPath(pluginBundleIdRef.current),
          {
            ...plugins[pluginBundleIdRef.current],
            bundleId: undefined,
            variables: variableTblRef.current.get(),
          },
          { encoding: 'utf-8', spaces: 4 }
        )
        .then(() => {
          Core.addUserConfigs(
            pluginBundleIdRef.current,
            'variables',
            variableTblRef.current.get()
          ).catch(console.error);

          ipcRenderer.send(IPCRendererEnum.reloadPlugin, {
            bundleId: pluginBundleIdRef.current,
          });
          return null;
        })
        .catch(console.error);
    }
  };

  /**
   * @summary
   */
  const ipcCallbackTbl = {
    openPluginInstallFileDialogRet: (
      e: Electron.IpcRendererEvent,
      { file }: { file: any }
    ) => {
      console.log('Open installer file: ', file);

      if (file.filePaths[0]) {
        setSpinning(true);
        const arvisPluginFilePath = file.filePaths[0];

        Core.installPlugin(arvisPluginFilePath)
          .then(() => {
            ipcRenderer.send(IPCRendererEnum.reloadPlugin, {
              destWindow: 'searchWindow',
            });

            fse.remove(arvisPluginFilePath).catch(console.error);
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
            setSpinning(false);
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
      setSpinning(true);
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
        .then(() => {
          ipcRenderer.send(IPCRendererEnum.reloadPlugin);
          return null;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setSpinning(false);
          ipcRenderer.send(IPCRendererEnum.resumeFileWatch);
        });
    },
  };

  useEffect(() => {
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
    pluginBundleIdRef.current = pluginBundleId;
  }, [pluginBundleId]);

  useEffect(() => {
    setSelectedIdxs(new Set([]));
    setSelectedPluginIdx(-1);
  }, [pluginBundleIds]);

  useEffect(() => {
    if (selectedPluginIdx === -1) {
      setPluginBundleId('');
      setWebviewUrl('');
      return;
    }

    if (pluginBundleIds.length) {
      const info = plugins[pluginBundleIds[selectedPluginIdx]];
      if (!info) return;

      const { creator = '', name = '', webAddress = '' } = info;
      const bundleId = Core.getBundleId(creator, name);

      setPluginBundleId(bundleId);
      setWebviewUrl(webAddress);

      if (variableTblRef.current) {
        variableTblRef.current.set(getVariableTbl(bundleId));
      }
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

  const itemDoubleClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    open(
      path.resolve(
        Core.path.getPluginInstalledPath(pluginBundleIds[idx]),
        'arvis-plugin.json'
      )
    );
  };

  const getDefaultIcon = (bundleId: string) => {
    const pluginRootPath = Core.path.getPluginInstalledPath(bundleId);
    const { defaultIcon } = plugins[bundleId];
    if (defaultIcon) {
      const pluginDefaultIconPath = path.resolve(pluginRootPath, defaultIcon);
      if (fse.existsSync(pluginDefaultIconPath)) {
        return pluginDefaultIconPath;
      }
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
        pluginWebAddress: plugins[bundleId].webAddress,
      });
    }

    ipcRenderer.send(IPCRendererEnum.popupPluginItemMenu, {
      items: JSON.stringify(selectedItemInfos),
    });

    forceUpdate();
  };

  const renderItem = (pluginInfo: any, idx: number) => {
    if (!pluginInfo) return <React.Fragment key={`pluginItem-${idx}`} />;
    const { creator, name, enabled, bundleId: itemBundleId } = pluginInfo;

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
        onDoubleClick={(e) => itemDoubleClickHandler(e, idx)}
        onContextMenu={(e: React.MouseEvent<HTMLInputElement>) => {
          pluginItemRightClickHandler(e, idx);
        }}
      >
        {icon}
        <PluginItemTitle style={applyDisabledStyle}>{name}</PluginItemTitle>
        <PluginItemCreatorText style={applyDisabledStyle}>
          {creator}
        </PluginItemCreatorText>
      </PluginItemContainer>
    );
  };

  const requestAddNewPlugin = () => {
    ipcRenderer.send(IPCRendererEnum.openPluginInstallFileDialog);
  };

  const deleteSelectedPlugin = (_pluginBundleIds: any, idxToRemove: number) => {
    if (!_pluginBundleIds.length) return;

    const targetBundleId = _pluginBundleIds[idxToRemove];

    setSpinning(true);
    Core.uninstallPlugin({
      bundleId: targetBundleId,
    })
      .then(async () => {
        ipcRenderer.send(IPCRendererEnum.reloadPlugin);

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
        setSpinning(false);
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

  const onKeyDownHandler = (e: React.KeyboardEvent) => {
    if (
      (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
      selectedPluginIdx === -1
    ) {
      setSelectedPluginIdx(0);
      setSelectedIdxs(new Set([0]));
      return;
    }

    if (e.shiftKey) {
      const minIdx = Math.min(...selectedIdxs.values());
      const maxIdx = Math.max(...selectedIdxs.values());

      if (e.key === 'ArrowUp' && minIdx !== 0) {
        if (selectedPluginIdx === maxIdx) {
          setSelectedIdxs(new Set([...selectedIdxs.values(), minIdx - 1]));
        } else {
          const newSet = selectedIdxs;
          newSet.delete(maxIdx);
          setSelectedIdxs(newSet);
          forceUpdate();
        }
      }
      if (e.key === 'ArrowDown' && maxIdx !== pluginBundleIds.length - 1) {
        if (selectedPluginIdx === minIdx) {
          setSelectedIdxs(new Set([...selectedIdxs.values(), maxIdx + 1]));
        } else {
          const newSet = selectedIdxs;
          newSet.delete(minIdx);
          setSelectedIdxs(newSet);
          forceUpdate();
        }
      }
    } else {
      if (e.key === 'ArrowUp' && selectedPluginIdx !== 0) {
        const minIdx = Math.min(...selectedIdxs.values());
        setSelectedPluginIdx(minIdx - 1);
        setSelectedIdxs(new Set([minIdx - 1]));
      }
      if (
        e.key === 'ArrowDown' &&
        selectedPluginIdx !== pluginBundleIds.length - 1
      ) {
        const maxIdx = Math.max(...selectedIdxs.values());
        setSelectedPluginIdx(maxIdx + 1);
        setSelectedIdxs(new Set([maxIdx + 1]));
      }
    }
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
    <OuterContainer
      id="plugin-page-container"
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
    >
      <Header
        style={{
          marginLeft: 40,
        }}
      >
        Installed Plugins
      </Header>
      <PluginListView>
        <SearchbarContainer>
          <SearchBar
            alwaysFocus={false}
            hasDragger={false}
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
        <PluginListOrderedList>
          {_.map(pluginBundleIds, (bundleId, idx) => {
            return renderItem(plugins[bundleId], idx);
          })}
        </PluginListOrderedList>
      </PluginListView>
      <PluginDescContainer>
        <TabNavigatorContainer>
          <Tabs
            style={{
              width: '100%',
            }}
          >
            <TabList>
              <Tab>Basic info</Tab>
              <Tab>User config</Tab>
              <Tab>README</Tab>
              <Tab>Web page</Tab>
            </TabList>
            <TabPanel>
              <PluginInfoTable info={plugins[pluginBundleId]} />
            </TabPanel>
            <TabPanel>
              {pluginBundleId && (
                <JsonEditor
                  ref={setVariableTblRef}
                  statusBar={false}
                  sortObjectKeys={false}
                  navigationBar={false}
                  history={false}
                  search={false}
                  onError={console.error}
                  value={getVariableTbl(pluginBundleId)}
                  onBlur={variableTblChangeHandler}
                  htmlElementProps={{
                    onBlur: variableTblChangeHandler,
                    style: {
                      height: 600,
                    },
                  }}
                />
              )}
            </TabPanel>
            <TabPanel>
              <ReadMeTable
                readme={
                  plugins[pluginBundleId]
                    ? plugins[pluginBundleId].readme
                    : null
                }
              />
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
                    marginTop: 16,
                    width: '90%',
                    height: '100%',
                  }}
                />
              )}
              {!webviewUrl && <div>There is no web address</div>}
            </TabPanel>
          </Tabs>
        </TabNavigatorContainer>
      </PluginDescContainer>

      <PluginListViewFooter>
        <AiOutlineAppstoreAdd
          className="plugin-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => requestAddNewPlugin()}
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
