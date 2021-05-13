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
  AiOutlineDelete,
  AiOutlineSave,
  AiOutlineBranches,
} from 'react-icons/ai';
import { BiExport } from 'react-icons/bi';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import path from 'path';
import fse from 'fs-extra';
import { homedir } from 'os';
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
import { StyledInput, Spinner } from '../../../components';
import { ScreenCoverContext } from '../screenCoverContext';
import './index.global.css';
import {
  bottomFixedBarIconStyle,
  checkboxStyle,
  descriptionContainerStyle,
  formGroupStyle,
  iconStyle,
  labelStyle,
} from './style';
import { IPCMainEnum, IPCRendererEnum } from '../../../ipc/ipcEventEnum';

export default function Workflow() {
  // object with bundleId as key and workflow info in value
  const [workflows, setWorkflows] = useState<any>({});
  const workflowsRef = useRef<any>();
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState<number>(0);
  const selectedWorkflowIdxRef = useRef<any>();

  const [workflowName, setWorkflowName] = useState<string>('');
  const [workflowVersion, setWorkflowVersion] = useState<string>('');
  const [workflowCreator, setWorkflowCreator] = useState<string>('');
  const [workflowBundleId, setWorkflowBundleId] = useState<string>('');
  const [workflowCategory, setWorkflowCategory] = useState<string>('');
  const [workflowDescription, setWorkflowDescription] = useState<string>('');
  const [workflowWebsite, setWorkflowWebsite] = useState<string>('');
  const [workflowEnabled, setWorkflowEnabled] = useState<boolean>(false);

  const forceUpdate = useForceUpdate();
  const [spinning, setSpinning] = useContext(ScreenCoverContext) as any;
  const deleteWorkflowEventHandler = useRef<any>();

  const fetchWorkflows = () => {
    const workflowsToSet = Core.getWorkflowList();

    setWorkflows(workflowsToSet);
    setSpinning(false);
    return null;
  };

  const ipcCallbackTbl = {
    saveFileRet: (e: Electron.IpcRendererEvent, { file }: { file: any }) => {
      Core.exportWorkflow(workflowBundleId, file.filePath);
    },

    openWfConfFileDialogRet: (e: Electron.IpcRendererEvent, fileInfo: any) => {
      if (fileInfo.file.filePaths[0]) {
        const arvisWorkflowFilePath = fileInfo.file.filePaths[0];

        Core.install(arvisWorkflowFilePath)
          .then(() => {
            fetchWorkflows();
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
      } else {
        setSpinning(false);
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
  };

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.saveFileRet, ipcCallbackTbl.saveFileRet);
    ipcRenderer.on(
      IPCMainEnum.openWfConfFileDialogRet,
      ipcCallbackTbl.openWfConfFileDialogRet
    );
    ipcRenderer.on(
      IPCMainEnum.openYesnoDialogRet,
      ipcCallbackTbl.openYesnoDialogRet
    );

    return () => {
      ipcRenderer.off(IPCMainEnum.saveFileRet, ipcCallbackTbl.saveFileRet);
      ipcRenderer.off(
        IPCMainEnum.openWfConfFileDialogRet,
        ipcCallbackTbl.openWfConfFileDialogRet
      );
      ipcRenderer.off(
        IPCMainEnum.openYesnoDialogRet,
        ipcCallbackTbl.openYesnoDialogRet
      );
    };
  }, []);

  useEffect(() => {
    const workflowBundleIds = Object.keys(workflows);

    if (workflowBundleIds.length) {
      const info = workflows[workflowBundleIds[selectedWorkflowIdx]];
      const {
        createdby = '',
        name = '',
        bundleId = '',
        version = '',
        webaddress = '',
        description = '',
        category = '',
        enabled = false,
      } = info;

      setWorkflowEnabled(enabled);
      setWorkflowName(name);
      setWorkflowCreator(createdby);
      setWorkflowBundleId(bundleId);
      setWorkflowCategory(category);
      setWorkflowDescription(description);
      setWorkflowVersion(version);
      setWorkflowWebsite(webaddress);
    }
  }, [selectedWorkflowIdx, workflows]);

  const itemClickHandler = (idx: number) => {
    setSelectedWorkflowIdx(idx);
  };

  const getDefaultIcon = (bundleId: string) => {
    const workflowRootPath = Core.path.getWorkflowInstalledPath(bundleId);
    if (!Core.getWorkflowList()[bundleId]) return undefined;
    const { defaultIcon } = Core.getWorkflowList()[bundleId];
    const workflowDefaultIconPath = `${workflowRootPath}${path.sep}${defaultIcon}`;

    if (fse.existsSync(workflowDefaultIconPath)) {
      return workflowDefaultIconPath;
    }
    return undefined;
  };

  const workflowItemRightClickHandler = (
    e: React.MouseEvent<HTMLInputElement>,
    bundleId: string
  ) => {
    e.preventDefault();
    const workflowRootPath = Core.path.getWorkflowInstalledPath(bundleId);
    ipcRenderer.send(IPCRendererEnum.popupWorkflowItemMenu, {
      path: workflowRootPath,
    });
  };

  const renderItem = (itemBundleId: string, idx: number) => {
    const info = workflows[itemBundleId];
    if (!info) return <></>;
    const { createdby, name } = info;

    let icon;
    const defaultIconPath = getDefaultIcon(itemBundleId);
    if (defaultIconPath) {
      icon = <WorkflowImg style={iconStyle} src={defaultIconPath} />;
    } else {
      icon = <AiOutlineBranches style={iconStyle} />;
    }

    let optionalStyle = {};
    if (selectedWorkflowIdx === idx) {
      optionalStyle = {
        backgroundColor: '#656C7B',
        borderRadius: 10,
        // Fix me! Not working!
        borderWidth: 1,
        borderColor: '#565A65',
      };
    }

    return (
      <WorkflowItemContainer
        style={optionalStyle}
        key={`workflowItem-${idx}`}
        onClick={() => itemClickHandler(idx)}
        onContextMenu={(e: React.MouseEvent<HTMLInputElement>) =>
          workflowItemRightClickHandler(e, itemBundleId)
        }
      >
        {icon}
        <WorkflowItemTitle>{name}</WorkflowItemTitle>
        <WorkflowItemCreatorText>{createdby}</WorkflowItemCreatorText>
      </WorkflowItemContainer>
    );
  };

  const requestAddNewWorkflow = () => {
    ipcRenderer.send(IPCRendererEnum.openWfConfFileDialog);
    setSpinning(true);
  };

  const saveWorkflow = () => {
    const targetPath = Core.path.getWorkflowConfigJsonPath(workflowBundleId);
    fse
      .readJson(targetPath)
      .then(async (json) => {
        json.enabled = workflowEnabled;
        json.bundleId = workflowBundleId;
        json.category = workflowCategory;
        json.createdby = workflowCreator;
        json.description = workflowDescription;
        json.name = workflowName;
        json.version = workflowVersion;
        json.webaddress = workflowWebsite;

        await fse.writeJson(targetPath, json, { encoding: 'utf8', spaces: 4 });
        return null;
      })
      .catch(console.error);
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
    if (workflowBundleIds.length === 0) return;

    setSpinning(true);

    const targetBundleId =
      workflowList[workflowBundleIds[idxToRemove]].bundleId;

    Core.unInstall({
      bundleId: targetBundleId,
    })
      .then(async () => {
        const temp = workflowList;
        delete temp[targetBundleId];
        setWorkflows(temp);

        if (idxToRemove !== 0) {
          setSelectedWorkflowIdx(idxToRemove - 1);
        } else {
          forceUpdate();
        }
        setSpinning(false);
        return null;
      })
      .catch(console.error);
  };

  useEffect(() => {
    workflowsRef.current = workflows;
    selectedWorkflowIdxRef.current = selectedWorkflowIdx;
  });

  useEffect(() => {
    fetchWorkflows();
    deleteWorkflowEventHandler.current = () => {
      deleteSelectedWorkflow(
        workflowsRef.current,
        selectedWorkflowIdxRef.current
      );
    };
  }, []);

  const callDeleteWorkflowConfModal = () => {
    const workflowBundleIds = Object.keys(workflows);
    if (workflowBundleIds.length === 0) return;

    ipcRenderer.send(IPCRendererEnum.openYesnoDialog, {
      msg: `Are you sure you want to delete '${workflowBundleId}'?`,
      icon: getDefaultIcon(workflowBundleId),
    });
  };

  return (
    <OuterContainer>
      {spinning && <Spinner center />}
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
            list={Object.keys(workflows)}
            renderItem={renderItem}
            renderWhenEmpty={() => <></>}
          />
        </WorkflowListOrderedList>
        <WorkflowListViewFooter>
          <AiOutlineAppstoreAdd
            className="workflow-page-buttons"
            style={bottomFixedBarIconStyle}
            onClick={() => requestAddNewWorkflow()}
          />
          <AiOutlineSave
            className="workflow-page-buttons"
            style={bottomFixedBarIconStyle}
            onClick={() => saveWorkflow()}
          />
          <BiExport
            className="workflow-page-buttons"
            style={bottomFixedBarIconStyle}
            onClick={() => exportWorkflow()}
          />
          <AiOutlineDelete
            className="workflow-page-buttons"
            style={bottomFixedBarIconStyle}
            onClick={() => callDeleteWorkflowConfModal()}
          />
        </WorkflowListViewFooter>
      </WorkflowListView>
      <WorkflowDescContainer>
        <Header
          style={{
            marginLeft: 20,
          }}
        >
          Workflow config
        </Header>
        <Form style={descriptionContainerStyle}>
          <FormGroup check style={checkboxStyle}>
            <Label checked style={labelStyle}>
              <Input
                type="checkbox"
                checked={workflowEnabled}
                onChange={() => {
                  setWorkflowEnabled(!workflowEnabled);
                }}
              />
              Enabled
            </Label>
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Name</Label>
            <StyledInput
              type="text"
              value={workflowName}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowName(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Version</Label>
            <StyledInput
              type="text"
              value={workflowVersion}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowVersion(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Creator</Label>
            <StyledInput
              type="text"
              value={workflowCreator}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowCreator(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Bundle Id</Label>
            <StyledInput
              type="text"
              disabled
              value={workflowBundleId}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                // Prevent editing workflow bundle id
                e.preventDefault();
              }}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Category</Label>
            <StyledInput
              type="text"
              value={workflowCategory}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowCategory(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Description</Label>
            {/* To do :: make description input auto height */}
            <StyledInput
              type="textarea"
              value={workflowDescription}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowDescription(e.currentTarget.value);
              }}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Web site</Label>
            <StyledInput
              type="url"
              value={workflowWebsite}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWorkflowWebsite(e.currentTarget.value);
              }}
            />
          </FormGroup>
        </Form>
      </WorkflowDescContainer>
    </OuterContainer>
  );
}
