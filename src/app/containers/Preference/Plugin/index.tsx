/* eslint-disable promise/no-nesting */
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
import { useExtensionSearchControl, useItemList } from '@hooks/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SpinnerContext } from '@helper/spinnerContext';
import {
  SearchBar,
  ExtensionUserVariableTable,
  ExtensionReadmeMarkdownRenderer,
  ExtensionInfoWebview,
} from '@components/index';
import PluginInfoTable from './infoTable';
import {
  Header,
  OuterContainer,
  PluginDescContainer,
  PluginImg,
  PluginListView,
  PluginListViewFooter,
  SearchbarContainer,
  TabNavigatorContainer,
} from './components';
import './index.css';
import * as style from './style';

const tabInfo = ['Basic Info', 'User Config', 'README', 'Web Page'];

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
  const selectedPluginIdxRef = useRef<any>();

  const [pluginBundleId, setPluginBundleId] = useState<string>('');
  const pluginBundleIdRef = useRef<string>(pluginBundleId);

  const [webviewUrl, setWebviewUrl] = useState<string>('');

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const [tabIndex, setTabIndex] = useState(0);

  const [pluginReadme, setPluginReadme] = useState<string>('');

  const forceUpdate = useForceUpdate();
  const deletePluginEventHandler = useRef<any>();

  const variableTblRef = useRef<any>();

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

  const makeItem = (pluginInfo: PluginConfigFile) => {
    const { creator, name, enabled, bundleId: itemBundleId } = pluginInfo;
    const applyDisabledStyle = enabled ? {} : style.disabledStyle;

    let icon;
    const defaultIconPath = getDefaultIcon(itemBundleId!);
    if (defaultIconPath) {
      icon = <PluginImg style={applyDisabledStyle} src={defaultIconPath} />;
    } else {
      icon = (
        <AiOutlineBranches
          style={{ ...applyDisabledStyle, ...style.defaultIconStyle }}
        />
      );
    }

    return {
      icon,
      enabled,
      title: name,
      subtitle: creator,
    };
  };

  const items = pluginBundleIds
    ? _.map(
        _.map(pluginBundleIds, (bundleId) => plugins[bundleId]),
        makeItem
      )
    : [];

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

  const itemRightClickCallback = (
    e: React.MouseEvent<HTMLInputElement>,
    clickedIdx: number,
    selectedIdxs: Set<number>
  ) => {
    e.preventDefault();

    const selectedItemInfos = [];

    for (const idx of selectedIdxs) {
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
  };

  const { itemList, clearIndex, selectedItemIdx, onKeyDownHandler } =
    useItemList({
      items,
      itemDoubleClickHandler,
      itemRightClickCallback,
    });

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
    clearIndex();
  }, [pluginBundleIds]);

  useEffect(() => {
    if (selectedItemIdx === -1) {
      setPluginBundleId('');
      setWebviewUrl('');
      return;
    }

    if (pluginBundleIds.length) {
      const info = plugins[pluginBundleIds[selectedItemIdx]];
      if (!info) return;

      const { creator = '', name = '', webAddress = '' } = info;
      const bundleId = Core.getBundleId(creator, name);

      setPluginBundleId(bundleId);
      setWebviewUrl(webAddress);

      if (variableTblRef.current) {
        variableTblRef.current.set(getVariableTbl(bundleId));
      }
    }
  }, [selectedItemIdx, plugins]);

  const requestAddNewPlugin = () => {
    ipcRenderer.send(IPCRendererEnum.openPluginInstallFileDialog);
  };

  const deleteSelectedPlugin = (
    _pluginBundleIds: string[],
    idxToRemove: number
  ) => {
    if (!_pluginBundleIds.length) return;

    const targetBundleId = _pluginBundleIds[idxToRemove];

    setSpinning(true);
    Core.uninstallPlugin({
      bundleId: targetBundleId,
    })
      .then(async () => {
        ipcRenderer.send(IPCRendererEnum.reloadPlugin);

        if (idxToRemove !== 0) {
          clearIndex();
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
    if (selectedItemIdx === -1) return;
    if (!pluginBundleIds.length) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${pluginBundleId}'?`,
      icon: getDefaultIcon(pluginBundleId),
    });
  };

  useEffect(() => {
    pluginBundleIdsRef.current = pluginBundleIds;
    selectedPluginIdxRef.current = selectedItemIdx;
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
        {itemList}
      </PluginListView>
      <PluginDescContainer>
        <TabNavigatorContainer>
          <Tabs
            selectedIndex={tabIndex}
            onSelect={setTabIndex}
            style={{
              width: '100%',
            }}
          >
            <TabList>
              {tabInfo.map((title, index) => (
                <Tab key={`tab-${index}`}>{title}</Tab>
              ))}
            </TabList>
            <TabPanel>
              <PluginInfoTable info={plugins[pluginBundleId]} />
            </TabPanel>
            <TabPanel>
              {pluginBundleId && (
                <ExtensionUserVariableTable
                  value={getVariableTbl(pluginBundleId)}
                  setVariableTblRef={setVariableTblRef}
                  variableTblChangeCallback={variableTblChangeHandler}
                />
              )}
            </TabPanel>
            <TabPanel>
              <ExtensionReadmeMarkdownRenderer
                extensionInfo={plugins[pluginBundleId]}
                readme={pluginReadme}
                setReadme={setPluginReadme}
                type="plugin"
                useAutoFetch={tabIndex === tabInfo.indexOf('README')}
              />
            </TabPanel>
            <TabPanel
              style={{
                height: '85%',
              }}
            >
              <ExtensionInfoWebview url={webviewUrl} />
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
