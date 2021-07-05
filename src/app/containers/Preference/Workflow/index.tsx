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
  AiOutlineExport,
} from 'react-icons/ai';
import path from 'path';
import fse from 'fs-extra';
import { homedir } from 'os';
import alphaSort from 'alpha-sort';
import open from 'open';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './index.global.css';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { StoreAvailabilityContext } from '@helper/storeAvailabilityContext';
import { isWithCtrlOrCmd, range } from '@utils/index';
import { WorkflowTriggerTable } from './workflowTriggerTable';
import WorkflowInfoTable from './infoTable';
import ReadMeTable from './readme';
import {
  Header,
  OuterContainer,
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

export default function Workflow() {
  // object with bundleId as key and workflow info in value
  const workflows = Core.getWorkflowList();
  const workflowBundleIds = Object.keys(workflows).sort((a, b) =>
    alphaSort({
      natural: true,
      caseInsensitive: true,
    })(Core.getNameFromBundleId(a), Core.getNameFromBundleId(b))
  );

  const workflowBundleIdsRef = useRef<any>(workflowBundleIds);
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState<number>(-1);
  const selectedWorkflowIdxRef = useRef<any>();

  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set([]));

  const [workflowBundleId, setWorkflowBundleId] = useState<string>('');

  const [webviewUrl, setWebviewUrl] = useState<string>('');

  const [storeAvailable, setStoreAvailable] = useContext(
    StoreAvailabilityContext
  ) as any;

  const forceUpdate = useForceUpdate();
  const deleteWorkflowEventHandler = useRef<any>();

  const workflowTriggers = Core.getTriggers();

  /**
   * @summary
   */
  const ipcCallbackTbl = {
    saveFileRet: (e: Electron.IpcRendererEvent, { file }: { file: any }) => {
      Core.exportWorkflow(workflowBundleId, file.filePath);
    },

    openWorkflowInstallFileDialogRet: (
      e: Electron.IpcRendererEvent,
      { file }: { file: any }
    ) => {
      console.log('Open installer file: ', file);

      if (file.filePaths[0]) {
        setStoreAvailable(false);
        const arvisWorkflowFilePath = file.filePaths[0];

        Core.installWorkflow(arvisWorkflowFilePath)
          .then(() => {
            ipcRenderer.send(IPCRendererEnum.renewWorkflow, {
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
            setStoreAvailable(true);
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
      setStoreAvailable(false);
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
          ipcRenderer.send(IPCRendererEnum.renewWorkflow);
          return null;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          ipcRenderer.send(IPCRendererEnum.resumeFileWatch);
          setStoreAvailable(true);
        });
    },
  };

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.saveFileRet, ipcCallbackTbl.saveFileRet);
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
      ipcRenderer.off(IPCMainEnum.saveFileRet, ipcCallbackTbl.saveFileRet);
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
    if (workflowBundleIds.length) {
      const info =
        selectedWorkflowIdx === -1
          ? {}
          : workflows[workflowBundleIds[selectedWorkflowIdx]];

      const { creator = '', name = '', webAddress } = info;

      const bundleId =
        selectedWorkflowIdx === -1 ? '' : Core.getBundleId(creator, name);

      setWorkflowBundleId(bundleId);
      setWebviewUrl(webAddress);
    }
  }, [selectedWorkflowIdx, workflows]);

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
      });
    }

    ipcRenderer.send(IPCRendererEnum.popupWorkflowItemMenu, {
      items: JSON.stringify(selectedItemInfos),
    });

    forceUpdate();
  };

  const renderItem = (workflow: any, idx: number) => {
    const itemBundleId = workflow.bundleId;
    const info = workflows[itemBundleId];
    if (!info) return <React.Fragment key={`workflowItem-${idx}`} />;
    const { creator, name, enabled } = info;

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

  const exportWorkflow = () => {
    if (selectedWorkflowIdx === -1) return;
    const defaultPath = path.resolve(
      homedir(),
      'Desktop',
      `${workflowBundleId}.arvisworkflow`
    );

    ipcRenderer.send(IPCRendererEnum.saveFile, {
      title: 'Select path to save',
      defaultPath,
    });
  };

  const deleteSelectedWorkflow = (
    _workflowBundleIds: any,
    idxToRemove: number
  ) => {
    if (!_workflowBundleIds.length) return;

    const targetBundleId = _workflowBundleIds[idxToRemove];

    setStoreAvailable(false);
    Core.uninstallWorkflow({
      bundleId: targetBundleId,
    })
      .then(async () => {
        ipcRenderer.send(IPCRendererEnum.renewWorkflow);

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
        setStoreAvailable(true);
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
        <WorkflowListOrderedList>
          {_.map(workflowBundleIds, (workflow, idx) => {
            return renderItem(workflows[workflow], idx);
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
              <Tab>README</Tab>
              <Tab>Web view</Tab>
            </TabList>
            <TabPanel>
              <WorkflowInfoTable info={workflows[workflowBundleId]} />
            </TabPanel>
            <TabPanel>
              <WorkflowTriggerTable
                bundleId={workflowBundleId}
                triggers={workflowTriggers[workflowBundleId]}
              />
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
        <AiOutlineExport
          className="workflow-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => exportWorkflow()}
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
