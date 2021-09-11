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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SpinnerContext } from '@helper/spinnerContext';
import { useExtensionSearchControl, useItemList } from '@hooks/index';
import { ItemInfo } from '@hooks/useItemList';
import {
  SearchBar,
  ExtensionInfoWebview,
  ExtensionReadmeMarkdownRenderer,
  ExtensionUserVariableTable,
} from '@components/index';
import { WorkflowTriggerTable } from './workflowTriggerTable';
import WorkflowInfoTable from './infoTable';
import {
  Header,
  OuterContainer,
  SearchbarContainer,
  TabNavigatorContainer,
  WorkflowDescContainer,
  WorkflowImg,
  WorkflowListView,
  WorkflowListViewFooter,
} from './components';
import * as style from './style';
import './index.css';

const tabInfo = [
  'Basic Info',
  'Trigger Table',
  'User Config',
  'README',
  'Web Page',
];

export default function Workflow() {
  const workflows = Core.getWorkflowList();
  const allWorkflowBundleIds = Object.keys(workflows).sort((a, b) =>
    alphaSort({
      natural: true,
      caseInsensitive: true,
    })(Core.getNameFromBundleId(a), Core.getNameFromBundleId(b))
  );

  const [workflowBundleIds, setWorkflowBundleIds] =
    useState<string[]>(allWorkflowBundleIds);

  const workflowBundleIdsRef = useRef<any>(workflowBundleIds);
  const selectedWorkflowIdxRef = useRef<any>();

  const [workflowBundleId, setWorkflowBundleId] = useState<string>('');
  const workflowBundleIdRef = useRef<string>(workflowBundleId);

  const [webviewUrl, setWebviewUrl] = useState<string>('');

  const [workflowReadme, setWorkflowReadme] = useState<string>('');

  const [tabIndex, setTabIndex] = useState(0);

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const forceUpdate = useForceUpdate();
  const deleteWorkflowEventHandler = useRef<any>();

  const workflowTriggers = Core.getTriggers();

  const variableTblRef = useRef<any>();

  const getDefaultIcon = (bundleId: string) => {
    const workflowRootPath = Core.path.getWorkflowInstalledPath(bundleId);
    const { defaultIcon } = workflows[bundleId];

    if (defaultIcon) {
      const workflowDefaultIconPath = path.resolve(
        workflowRootPath,
        defaultIcon
      );

      if (fse.existsSync(workflowDefaultIconPath)) {
        return workflowDefaultIconPath;
      }
    }

    return undefined;
  };

  const makeItem = (workflowInfo: WorkflowConfigFile): ItemInfo => {
    const { creator, name, enabled, bundleId: itemBundleId } = workflowInfo;
    const applyDisabledStyle = enabled ? {} : style.disabledStyle;

    let icon;
    const defaultIconPath = getDefaultIcon(itemBundleId!);
    if (defaultIconPath) {
      icon = <WorkflowImg style={applyDisabledStyle} src={defaultIconPath} />;
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

  const items = workflowBundleIds
    ? _.map(
        _.map(workflowBundleIds, (bundleId) => workflows[bundleId]),
        makeItem
      )
    : [];

  const itemDoubleClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    open(
      path.resolve(
        Core.path.getWorkflowInstalledPath(workflowBundleIds[idx]),
        'arvis-workflow.json'
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
      const bundleId = workflowBundleIds[idx];
      selectedItemInfos.push({
        workflowPath: Core.path.getWorkflowInstalledPath(bundleId),
        workflowEnabled: workflows[bundleId].enabled,
        workflowWebAddress: workflows[bundleId].webAddress,
      });
    }

    ipcRenderer.send(IPCRendererEnum.popupWorkflowItemMenu, {
      items: JSON.stringify(selectedItemInfos),
    });
  };

  const { itemList, clearIndex, selectedItemIdx, onKeyDownHandler } =
    useItemList({
      items,
      itemDoubleClickHandler,
      itemRightClickCallback,
    });

  const { getInputProps } = useExtensionSearchControl({
    items: workflowBundleIds,
    originalItems: allWorkflowBundleIds,
    setItems: setWorkflowBundleIds,
    extensionInfos: workflows,
  });

  const setVariableTblRef = (instance: any) => {
    if (instance) {
      variableTblRef.current = instance.jsonEditor;
    } else {
      variableTblRef.current = null;
    }
  };

  const getVariableTbl = (bundleId: string) => {
    if (!workflows[bundleId]) return {};
    return workflows[bundleId].variables ? workflows[bundleId].variables : {};
  };

  const variableTblChangeHandler = (e: any) => {
    if (!workflowBundleId || _.isNil(variableTblRef.current)) return;

    if (
      !_.isEqual(
        workflows[workflowBundleIdRef.current].variables,
        variableTblRef.current.get()
      )
    ) {
      fse
        .writeJSON(
          Core.path.getWorkflowConfigJsonPath(workflowBundleIdRef.current),
          {
            ...workflows[workflowBundleIdRef.current],
            bundleId: undefined,
            variables: variableTblRef.current.get(),
          },
          { encoding: 'utf-8', spaces: 4 }
        )
        .then(() => {
          Core.addUserConfigs(
            workflowBundleIdRef.current,
            'variables',
            variableTblRef.current.get()
          ).catch(console.error);

          ipcRenderer.send(IPCRendererEnum.reloadWorkflow, {
            bundleId: workflowBundleIdRef.current,
          });
          return null;
        })
        .catch(console.error);
    }
  };

  /**
   */
  const ipcCallbackTbl = {
    openWorkflowInstallFileDialogRet: (
      e: Electron.IpcRendererEvent,
      { file }: { file: any }
    ) => {
      console.log('Open installer file: ', file);

      if (file.filePaths[0]) {
        setSpinning(true);
        const arvisWorkflowFilePath = file.filePaths[0];

        Core.installWorkflow(arvisWorkflowFilePath)
          .then(() => {
            ipcRenderer.send(IPCRendererEnum.reloadWorkflow, {
              destWindow: 'searchWindow',
            });

            fse.remove(arvisWorkflowFilePath).catch(console.error);
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
        deleteWorkflowEventHandler.current();
      }
    },

    toggleWorkflowsEnabled: (
      e: Electron.IpcRendererEvent,
      { bundleIds, enabled }: { bundleIds: string; enabled: string }
    ) => {
      setSpinning(true);
      const bundleIdList = JSON.parse(bundleIds) as string[];
      const works: Promise<any>[] = [];

      ipcRenderer.send(IPCRendererEnum.stopFileWatch);
      for (const bundleId of bundleIdList) {
        const targetPath = Core.path.getWorkflowConfigJsonPath(bundleId);
        const targetJson = Core.getWorkflowList()[bundleId];

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
          ipcRenderer.send(IPCRendererEnum.reloadWorkflow);
          return null;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          ipcRenderer.send(IPCRendererEnum.resumeFileWatch);
          setSpinning(false);
        });
    },
  };

  useEffect(() => {
    ipcRenderer.on(
      IPCMainEnum.openWorkflowInstallFileDialogRet,
      ipcCallbackTbl.openWorkflowInstallFileDialogRet
    );
    ipcRenderer.on(
      IPCMainEnum.openYesnoDialogRet,
      ipcCallbackTbl.openYesnoDialogRet
    );
    ipcRenderer.on(
      IPCMainEnum.toggleWorkflowsEnabled,
      ipcCallbackTbl.toggleWorkflowsEnabled
    );

    return () => {
      ipcRenderer.off(
        IPCMainEnum.openWorkflowInstallFileDialogRet,
        ipcCallbackTbl.openWorkflowInstallFileDialogRet
      );
      ipcRenderer.off(
        IPCMainEnum.openYesnoDialogRet,
        ipcCallbackTbl.openYesnoDialogRet
      );
      ipcRenderer.off(
        IPCMainEnum.toggleWorkflowsEnabled,
        ipcCallbackTbl.toggleWorkflowsEnabled
      );
    };
  }, []);

  useEffect(() => {
    if (selectedItemIdx === -1) {
      setWorkflowBundleId('');
      setWebviewUrl('');
      return;
    }

    if (workflowBundleIds.length) {
      const info = workflows[workflowBundleIds[selectedItemIdx]];
      if (!info) return;

      const { creator = '', name = '', webAddress = '' } = info;
      const bundleId = Core.getBundleId(creator, name);

      setWorkflowBundleId(bundleId);
      setWebviewUrl(webAddress);

      if (variableTblRef.current) {
        variableTblRef.current.set(getVariableTbl(bundleId));
      }
    }
  }, [selectedItemIdx, workflows]);

  useEffect(() => {
    workflowBundleIdRef.current = workflowBundleId;
  }, [workflowBundleId]);

  useEffect(() => {
    clearIndex();
  }, [workflowBundleIds]);

  const requestAddNewWorkflow = () => {
    ipcRenderer.send(IPCRendererEnum.openWorkflowInstallFileDialog);
  };

  const deleteSelectedWorkflow = (
    _workflowBundleIds: string[],
    idxToRemove: number
  ) => {
    if (!_workflowBundleIds.length) return;

    const targetBundleId = _workflowBundleIds[idxToRemove];

    setSpinning(true);
    Core.uninstallWorkflow({
      bundleId: targetBundleId,
    })
      .then(async () => {
        ipcRenderer.send(IPCRendererEnum.reloadWorkflow);

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

  const callDeleteWorkflowConfModal = () => {
    if (selectedItemIdx === -1) return;
    if (!workflowBundleIds.length) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${workflowBundleId}'?`,
      icon: getDefaultIcon(workflowBundleId),
    });
  };

  useEffect(() => {
    workflowBundleIdsRef.current = workflowBundleIds;
    selectedWorkflowIdxRef.current = selectedItemIdx;
  });

  useEffect(() => {
    Core.Store.onStoreUpdate = () => {
      forceUpdate();
    };

    deleteWorkflowEventHandler.current = () => {
      deleteSelectedWorkflow(
        workflowBundleIdsRef.current,
        selectedWorkflowIdxRef.current
      );
    };
  }, []);

  return (
    <OuterContainer
      id="workflow-page-container"
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
    >
      <Header
        style={{
          marginLeft: 40,
        }}
      >
        Installed Workflows
      </Header>
      <WorkflowListView>
        <SearchbarContainer>
          <SearchBar
            alwaysFocus={false}
            getInputProps={getInputProps}
            hasDragger={false}
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
      </WorkflowListView>
      <WorkflowDescContainer>
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
              <WorkflowInfoTable info={workflows[workflowBundleId]} />
            </TabPanel>
            <TabPanel
              style={{
                height: '90%',
              }}
            >
              <WorkflowTriggerTable
                bundleId={workflowBundleId}
                triggers={workflowTriggers[workflowBundleId]}
              />
            </TabPanel>
            <TabPanel>
              {workflowBundleId && (
                <ExtensionUserVariableTable
                  value={getVariableTbl(workflowBundleId)}
                  setVariableTblRef={setVariableTblRef}
                  variableTblChangeCallback={variableTblChangeHandler}
                />
              )}
            </TabPanel>
            <TabPanel>
              <ExtensionReadmeMarkdownRenderer
                extensionInfo={workflows[workflowBundleId]}
                readme={workflowReadme}
                setReadme={setWorkflowReadme}
                type="workflow"
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
      </WorkflowDescContainer>

      <WorkflowListViewFooter>
        <AiOutlineAppstoreAdd
          className="workflow-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => requestAddNewWorkflow()}
        />
        <AiOutlineDelete
          className="workflow-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => callDeleteWorkflowConfModal()}
        />
      </WorkflowListViewFooter>
    </OuterContainer>
  );
}
