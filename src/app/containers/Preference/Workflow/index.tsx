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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { JsonEditor } from 'jsoneditor-react';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SpinnerContext } from '@helper/spinnerContext';
import { useExtensionSearchControl } from '@hooks/index';
import { isWithCtrlOrCmd, range } from '@utils/index';
import { SearchBar } from '@components/index';
import { WorkflowTriggerTable } from './workflowTriggerTable';
import WorkflowInfoTable from './infoTable';
import ReadMeTable from './readme';
import {
  Header,
  OuterContainer,
  SearchbarContainer,
  TabNavigatorContainer,
  WorkflowDescContainer,
  WorkflowImg,
  WorkflowItemContainer,
  WorkflowItemCreatorText,
  WorkflowItemTitle,
  WorkflowListOrderedList,
  WorkflowListView,
  WorkflowListViewFooter,
} from './components';
import * as style from './style';
import './index.global.css';

export default function Workflow() {
  // object with bundleId as key and workflow info in value
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
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState<number>(-1);
  const selectedWorkflowIdxRef = useRef<any>();

  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set([]));

  const [workflowBundleId, setWorkflowBundleId] = useState<string>('');
  const workflowBundleIdRef = useRef<string>(workflowBundleId);

  const [webviewUrl, setWebviewUrl] = useState<string>('');

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const forceUpdate = useForceUpdate();
  const deleteWorkflowEventHandler = useRef<any>();

  const workflowTriggers = Core.getTriggers();

  const variableTblRef = useRef<any>();

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
    if (!e.target || !e.target.classList) return;

    if (
      !e.target.classList.contains('jsoneditor-field') &&
      !e.target.classList.contains('jsoneditor-value') &&
      !e.target.classList.contains('jsoneditor-remove')
    )
      return;

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
   * @summary
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
    if (selectedWorkflowIdx === -1) {
      setWorkflowBundleId('');
      setWebviewUrl('');
      return;
    }

    if (workflowBundleIds.length) {
      const info = workflows[workflowBundleIds[selectedWorkflowIdx]];
      if (!info) return;

      const { creator = '', name = '', webAddress = '' } = info;
      const bundleId = Core.getBundleId(creator, name);

      setWorkflowBundleId(bundleId);
      setWebviewUrl(webAddress);

      if (variableTblRef.current) {
        variableTblRef.current.set(getVariableTbl(bundleId));
      }
    }
  }, [selectedWorkflowIdx, workflows]);

  useEffect(() => {
    workflowBundleIdRef.current = workflowBundleId;
  }, [workflowBundleId]);

  useEffect(() => {
    setSelectedIdxs(new Set([]));
    setSelectedWorkflowIdx(-1);
  }, [workflowBundleIds]);

  const itemClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    const swap = new Set(selectedIdxs);
    if (e.shiftKey) {
      const from = selectedWorkflowIdx > idx ? idx : selectedWorkflowIdx;
      const to = selectedWorkflowIdx < idx ? idx : selectedWorkflowIdx;
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
      setSelectedWorkflowIdx(idx);
    }
    forceUpdate();
  };

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

  const workflowItemRightClickHandler = (
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

    forceUpdate();
  };

  const renderItem = (workflowInfo: any, idx: number) => {
    if (!workflowInfo) return <React.Fragment key={`workflowItem-${idx}`} />;
    const { creator, name, enabled, bundleId: itemBundleId } = workflowInfo;

    const applyDisabledStyle = enabled ? {} : style.disabledStyle;
    const workflowItemStyle = selectedIdxs.has(idx)
      ? style.selectedItemStyle
      : {};

    let icon;
    const defaultIconPath = getDefaultIcon(itemBundleId);
    if (defaultIconPath) {
      icon = <WorkflowImg style={applyDisabledStyle} src={defaultIconPath} />;
    } else {
      icon = (
        <AiOutlineBranches
          style={{ ...applyDisabledStyle, ...style.defaultIconStyle }}
        />
      );
    }

    return (
      <WorkflowItemContainer
        style={workflowItemStyle}
        key={`workflowItem-${idx}`}
        onClick={(e) => itemClickHandler(e, idx)}
        onDoubleClick={(e) => itemDoubleClickHandler(e, idx)}
        onContextMenu={(e: React.MouseEvent<HTMLInputElement>) => {
          workflowItemRightClickHandler(e, idx);
        }}
      >
        {icon}
        <WorkflowItemTitle style={applyDisabledStyle}>{name}</WorkflowItemTitle>
        <WorkflowItemCreatorText style={applyDisabledStyle}>
          {creator}
        </WorkflowItemCreatorText>
      </WorkflowItemContainer>
    );
  };

  const requestAddNewWorkflow = () => {
    ipcRenderer.send(IPCRendererEnum.openWorkflowInstallFileDialog);
  };

  const deleteSelectedWorkflow = (
    _workflowBundleIds: any,
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
          setSelectedWorkflowIdx(-1);
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

  const callDeleteWorkflowConfModal = () => {
    if (selectedWorkflowIdx === -1) return;
    if (!workflowBundleIds.length) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${workflowBundleId}'?`,
      icon: getDefaultIcon(workflowBundleId),
    });
  };

  const onKeyDownHandler = (e: React.KeyboardEvent) => {
    if (
      (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
      selectedWorkflowIdx === -1
    ) {
      setSelectedWorkflowIdx(0);
      setSelectedIdxs(new Set([0]));
      return;
    }

    if (e.shiftKey) {
      const minIdx = Math.min(...selectedIdxs.values());
      const maxIdx = Math.max(...selectedIdxs.values());

      if (e.key === 'ArrowUp' && minIdx !== 0) {
        if (selectedWorkflowIdx === maxIdx) {
          setSelectedIdxs(new Set([...selectedIdxs.values(), minIdx - 1]));
        } else {
          const newSet = selectedIdxs;
          newSet.delete(maxIdx);
          setSelectedIdxs(newSet);
          forceUpdate();
        }
      }
      if (e.key === 'ArrowDown' && maxIdx !== workflowBundleIds.length - 1) {
        if (selectedWorkflowIdx === minIdx) {
          setSelectedIdxs(new Set([...selectedIdxs.values(), maxIdx + 1]));
        } else {
          const newSet = selectedIdxs;
          newSet.delete(minIdx);
          setSelectedIdxs(newSet);
          forceUpdate();
        }
      }
    } else {
      if (e.key === 'ArrowUp' && selectedWorkflowIdx !== 0) {
        const minIdx = Math.min(...selectedIdxs.values());
        setSelectedWorkflowIdx(minIdx - 1);
        setSelectedIdxs(new Set([minIdx - 1]));
      }
      if (
        e.key === 'ArrowDown' &&
        selectedWorkflowIdx !== workflowBundleIds.length - 1
      ) {
        const maxIdx = Math.max(...selectedIdxs.values());
        setSelectedWorkflowIdx(maxIdx + 1);
        setSelectedIdxs(new Set([maxIdx + 1]));
      }
    }
  };

  useEffect(() => {
    workflowBundleIdsRef.current = workflowBundleIds;
    selectedWorkflowIdxRef.current = selectedWorkflowIdx;
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

        <WorkflowListOrderedList>
          {_.map(workflowBundleIds, (bundleId, idx) => {
            return renderItem(workflows[bundleId], idx);
          })}
        </WorkflowListOrderedList>
      </WorkflowListView>
      <WorkflowDescContainer>
        <TabNavigatorContainer>
          <Tabs
            style={{
              width: '100%',
            }}
          >
            <TabList>
              <Tab>Basic info</Tab>
              <Tab>Trigger table</Tab>
              <Tab>User config</Tab>
              <Tab>README</Tab>
              <Tab>Web page</Tab>
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
                <JsonEditor
                  ref={setVariableTblRef}
                  statusBar={false}
                  sortObjectKeys={false}
                  navigationBar={false}
                  history={false}
                  search={false}
                  onError={console.error}
                  value={getVariableTbl(workflowBundleId)}
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
                  workflows[workflowBundleId]
                    ? workflows[workflowBundleId].readme
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
