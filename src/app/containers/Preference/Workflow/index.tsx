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
import { useSelector } from 'react-redux';
import { StyledInput } from '@components/index';
import './index.global.css';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { StateType } from '@redux/reducers/types';
import { StoreAvailabilityContext } from '@helper/storeAvailabilityContext';
import { isWithCtrlOrCmd, range } from '@utils/index';
import {
  Header,
  OuterContainer,
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
  const workflowBundleIds = Object.keys(workflows).sort((a, b) => {
    return Core.getNameFromBundleId(a).toLowerCase() <
      Core.getNameFromBundleId(b).toLowerCase()
      ? -1
      : 1;
  });

  const workflowBundleIdsRef = useRef<any>(workflowBundleIds);
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState<number>(-1);
  const selectedWorkflowIdxRef = useRef<any>();

  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set([]));

  const [workflowBundleId, setWorkflowBundleId] = useState<string>('');
  const [workflowCategory, setWorkflowCategory] = useState<string>('');
  const [workflowCreator, setWorkflowCreator] = useState<string>('');
  const [workflowDescription, setWorkflowDescription] = useState<string>('');
  const [workflowName, setWorkflowName] = useState<string>('');
  const [workflowReadme, setWorkflowReadme] = useState<string>('');
  const [workflowVersion, setWorkflowVersion] = useState<string>('');
  const [workflowWebsite, setWorkflowWebsite] = useState<string>('');

  const [storeAvailable, setStoreAvailable] = useContext(
    StoreAvailabilityContext
  ) as any;

  const { can_install_alfredworkflow } = useSelector(
    (state: StateType) => state.advanced_config
  );

  const forceUpdate = useForceUpdate();
  const deleteWorkflowEventHandler = useRef<any>();

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
      if (file.filePaths[0]) {
        setStoreAvailable(false);
        const arvisWorkflowFilePath = file.filePaths[0];

        Core.installWorkflow(arvisWorkflowFilePath)
          .then(() => {
            ipcRenderer.send(IPCRendererEnum.renewWorkflow, {
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
        selectedWorkflowIdx === -1 ? '' : Core.getBundleId(createdby, name);

      setWorkflowBundleId(bundleId);
      setWorkflowCategory(category);
      setWorkflowCreator(createdby);
      setWorkflowDescription(description);
      setWorkflowName(name);
      setWorkflowReadme(readme);
      setWorkflowVersion(version);
      setWorkflowWebsite(webaddress);
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

  const getDefaultIcon = (bundleId: string) => {
    const workflowRootPath = Core.path.getWorkflowInstalledPath(bundleId);
    const { defaultIcon } = workflows[bundleId];
    const workflowDefaultIconPath = path.resolve(workflowRootPath, defaultIcon);

    if (fse.existsSync(workflowDefaultIconPath)) {
      return workflowDefaultIconPath;
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
    const { createdby, name, enabled } = info;

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
        onContextMenu={(e: React.MouseEvent<HTMLInputElement>) => {
          workflowItemRightClickHandler(e, idx);
        }}
      >
        {icon}
        <WorkflowItemTitle style={applyDisabledStyle}>{name}</WorkflowItemTitle>
        <WorkflowItemCreatorText style={applyDisabledStyle}>
          {createdby}
        </WorkflowItemCreatorText>
      </WorkflowItemContainer>
    );
  };

  const requestAddNewWorkflow = () => {
    ipcRenderer.send(IPCRendererEnum.openWorkflowInstallFileDialog, {
      canInstallAlfredWorkflow: can_install_alfredworkflow,
    });
  };

  const editWorkflow = () => {
    if (selectedWorkflowIdx === -1) return;
    setStoreAvailable(false);
    const targetPath = Core.path.getWorkflowConfigJsonPath(workflowBundleId);
    fse
      .readJson(targetPath)
      .then(async (json) => {
        json.category = workflowCategory;
        json.description = workflowDescription;
        json.readme = workflowReadme;
        json.version = workflowVersion;
        json.webaddress = workflowWebsite;

        await fse.writeJson(targetPath, json, { encoding: 'utf8', spaces: 4 });
        return null;
      })
      .catch((err) => {
        setStoreAvailable(true);
        console.error(err);
      });
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
    <OuterContainer>
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
        <Form style={style.descriptionContainerStyle}>
          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Name</Label>
            <StyledInput
              disabled
              type="text"
              placeholder="Name"
              value={workflowName}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowName(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Creator</Label>
            <StyledInput
              disabled
              type="text"
              placeholder="Creator"
              value={workflowCreator}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowCreator(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Version</Label>
            <StyledInput
              type="text"
              placeholder="Version"
              value={workflowVersion}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowVersion(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Category</Label>
            <StyledInput
              type="text"
              placeholder="Category"
              value={workflowCategory}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowCategory(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Description</Label>
            <StyledInput
              type="text"
              placeholder="Description"
              value={workflowDescription}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowDescription(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Read Me</Label>
            <StyledInput
              type="textarea"
              className="workflow-page-textarea"
              placeholder="README"
              style={{
                height: 260,
              }}
              value={workflowReadme}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowReadme(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Web Site</Label>
            <StyledInput
              type="url"
              placeholder="Web Site"
              value={workflowWebsite}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowWebsite(e.currentTarget.value);
              }}
            />
          </FormGroup>
        </Form>
      </WorkflowDescContainer>

      <WorkflowListViewFooter>
        <AiOutlineAppstoreAdd
          className="workflow-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => requestAddNewWorkflow()}
        />
        <AiOutlineEdit
          className="workflow-page-buttons"
          style={style.bottomFixedBarIconStyle}
          onClick={() => editWorkflow()}
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
