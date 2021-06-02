/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Core } from '@jopemachine/arvis-core';
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
  const [workflows, setWorkflows] = useState<any>({});
  const workflowsRef = useRef<any>();
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState<number>(0);
  const selectedWorkflowIdxRef = useRef<any>();

  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(
    new Set([selectedWorkflowIdx])
  );

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

  const fetchWorkflows = () => {
    // Set workflows object to Core's workflow list.
    // If there is any update, Automatically updates from Core
    setWorkflows(Core.getWorkflowList());
    return null;
  };

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

        ipcRenderer.send(IPCRendererEnum.stopFileWatch);

        Core.installWorkflow(arvisWorkflowFilePath)
          .then(() => {
            fetchWorkflows();
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
            ipcRenderer.send(IPCRendererEnum.resumeFileWatch);
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

    toggleWorkflowEnabled: (
      e: Electron.IpcRendererEvent,
      { bundleId, enabled }: { bundleId: string; enabled: string }
    ) => {
      setStoreAvailable(false);
      const targetPath = Core.path.getWorkflowConfigJsonPath(bundleId);
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
      IPCMainEnum.openWorkflowInstallFileDialogRet,
      ipcCallbackTbl.openWorkflowInstallFileDialogRet
    );
    ipcRenderer.on(
      IPCMainEnum.openYesnoDialogRet,
      ipcCallbackTbl.openYesnoDialogRet
    );
    ipcRenderer.on(
      IPCMainEnum.toggleWorkflowEnabled,
      ipcCallbackTbl.toggleWorkflowEnabled
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
        IPCMainEnum.toggleWorkflowEnabled,
        ipcCallbackTbl.toggleWorkflowEnabled
      );
    };
  }, []);

  useEffect(() => {
    const workflowBundleIds = Object.keys(workflows);

    if (workflowBundleIds.length) {
      const info = workflows[workflowBundleIds[selectedWorkflowIdx]];
      const {
        bundleId = '',
        category = '',
        createdby = '',
        description = '',
        name = '',
        readme = '',
        version = '',
        webaddress = '',
      } = info;

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
    const workflowDefaultIconPath = `${workflowRootPath}${path.sep}${defaultIcon}`;

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
      const bundleId = Object.keys(workflows)[idx];
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
    if (!info) return <></>;
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
    setStoreAvailable(false);
    const targetPath = Core.path.getWorkflowConfigJsonPath(workflowBundleId);
    fse
      .readJson(targetPath)
      .then(async (json) => {
        json.bundleId = workflowBundleId;
        json.category = workflowCategory;
        json.createdby = workflowCreator;
        json.description = workflowDescription;
        json.name = workflowName;
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
    const defaultPath = `${homedir()}${path.sep}Desktop${
      path.sep
    }${workflowBundleId}.arvisworkflow`;

    ipcRenderer.send(IPCRendererEnum.saveFile, {
      title: 'Select path to save',
      defaultPath,
    });
  };

  const deleteSelectedWorkflow = (workflowList: any, idxToRemove: number) => {
    const workflowBundleIds = Object.keys(workflowList);
    if (!workflowBundleIds.length) return;

    const targetBundleId =
      workflowList[workflowBundleIds[idxToRemove]].bundleId;

    ipcRenderer.send(IPCRendererEnum.stopFileWatch);

    setStoreAvailable(false);
    Core.uninstallWorkflow({
      bundleId: targetBundleId,
    })
      .then(async () => {
        const temp = workflowList;
        delete temp[targetBundleId];
        setWorkflows(temp);

        ipcRenderer.send(IPCRendererEnum.renewWorkflow, {
          destWindow: 'searchWindow',
        });

        if (idxToRemove !== 0) {
          setSelectedWorkflowIdx(idxToRemove - 1);
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
        ipcRenderer.send(IPCRendererEnum.resumeFileWatch);
      });
  };

  const callDeleteWorkflowConfModal = () => {
    const workflowBundleIds = Object.keys(workflows);
    if (!workflowBundleIds.length) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${workflowBundleId}'?`,
      icon: getDefaultIcon(workflowBundleId),
    });
  };

  useEffect(() => {
    workflowsRef.current = workflows;
    selectedWorkflowIdxRef.current = selectedWorkflowIdx;
  });

  useEffect(() => {
    Core.Store.onStoreUpdate = () => {
      forceUpdate();
    };

    fetchWorkflows();
    deleteWorkflowEventHandler.current = () => {
      deleteSelectedWorkflow(
        workflowsRef.current,
        selectedWorkflowIdxRef.current
      );
    };
  }, []);

  return (
    <OuterContainer>
      <WorkflowListView>
        <Header
          style={{
            marginLeft: 40,
          }}
        >
          Installed Workflows
        </Header>
        <WorkflowListOrderedList>
          <FlatList
            list={workflows}
            renderItem={renderItem}
            renderWhenEmpty={() => <></>}
          />
        </WorkflowListOrderedList>
      </WorkflowListView>
      <WorkflowDescContainer>
        <Header
          style={{
            marginLeft: 20,
          }}
        >
          Workflow config
        </Header>
        <Form style={style.descriptionContainerStyle}>
          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Name</Label>
            <StyledInput
              type="text"
              placeholder="Name"
              value={workflowName}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowName(e.currentTarget.value);
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
            <Label style={style.labelStyle}>Creator</Label>
            <StyledInput
              type="text"
              placeholder="Creator"
              value={workflowCreator}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowCreator(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={style.formGroupStyle}>
            <Label style={style.labelStyle}>Bundle Id</Label>
            <StyledInput
              type="text"
              disabled
              placeholder="Bundle Id"
              value={workflowBundleId}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                // Prevent editing workflow bundle id
                e.preventDefault();
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
              placeholder="Read Me"
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
