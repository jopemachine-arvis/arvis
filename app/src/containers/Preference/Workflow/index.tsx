/* eslint-disable react/jsx-curly-newline */
/* eslint-disable prettier/prettier */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Core } from 'wf-creator-core';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import FlatList from 'flatlist-react';
import { ipcRenderer } from 'electron';
import useForceUpdate from 'use-force-update';

import {
  AiOutlineAppstoreAdd,
  AiOutlineDelete,
  AiOutlineFileAdd,
  AiOutlineBranches
} from 'react-icons/ai';

import { CgSmileNone } from 'react-icons/cg';

import { Form, FormGroup, Label, Input } from 'reactstrap';
import path from 'path';
import fse from 'fs-extra';
import {
  EmptyListContainer,
  EmptyListDesc,
  Header,
  OuterContainer,
  WorkflowDescContainer,
  WorkflowImg,
  WorkflowItemContainer,
  WorkflowItemCreatorText,
  WorkflowItemTitle,
  WorkflowListOrderedList,
  WorkflowListView,
  WorkflowListViewFooter
} from './components';

import { StyledInput, Spinner } from '../../../components';

import {
  bottomFixedBarIconStyle,
  checkboxStyle,
  descriptionContainerStyle,
  emptyListIconStyle,
  formGroupStyle,
  iconStyle,
  labelStyle
} from './style';

import { ScreenCoverContext } from '../screenCoverContext';

import WorkflowItemMenu from '../../../components/contextMenus/workflow';

import './index.global.css';

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

  const fetchWorkflows = () => {
    Core.getWorkflowList(StoreType.Electron)
      .then((workflowsToSet: object) => {
        setWorkflows(workflowsToSet);
        setSpinning(false);
        return null;
      })
      .catch((err: any) => console.error(err));
  };

  useEffect(() => {
    const workflowBundleIds = Object.keys(workflows);

    if (workflowBundleIds.length >= 1) {
      const info = workflows[workflowBundleIds[selectedWorkflowIdx]];
      const {
        createdby,
        name,
        bundleId,
        version,
        webaddress,
        description,
        category,
        enabled
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
  }, [selectedWorkflowIdx, Object.keys(workflows).length]);

  const deleteWorkflowEventHandler = useRef<any>();

  const itemClickHandler = (idx: number) => {
    setSelectedWorkflowIdx(idx);
  };

  const getDefaultIcon = (bundleId: string) => {
    const workflowRootPath = `${Core.path.workflowInstallPath}${path.sep}installed${path.sep}${bundleId}`;
    const workflowDefaultIconPath = `${workflowRootPath}${path.sep}icon.png`;

    if (fse.existsSync(workflowDefaultIconPath)) {
      return workflowDefaultIconPath;
    }
    return undefined;
  };

  const workflowItemRightClickHandler = (e: any, bundleId: string) => {
    e.preventDefault();
    const workflowRootPath = `${Core.path.workflowInstallPath}${path.sep}installed${path.sep}${bundleId}`;
    ipcRenderer.send('popup-workflowItem-menu', { path: workflowRootPath });
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
        borderColor: '#565A65'
      };
    }

    return (
      <WorkflowItemContainer
        style={optionalStyle}
        key={`workflowItem-${idx}`}
        onClick={() => itemClickHandler(idx)}
        onContextMenu={(e: any) =>
          workflowItemRightClickHandler(e, itemBundleId)
        }
      >
        {icon}
        <WorkflowItemTitle>{name}</WorkflowItemTitle>
        <WorkflowItemCreatorText>{createdby}</WorkflowItemCreatorText>
      </WorkflowItemContainer>
    );
  };

  const addNewWorkflowByFile = () => {
    ipcRenderer.send('open-wfconf-file-dialog');
    setSpinning(true);

    ipcRenderer.on('open-wfconf-file-dialog-ret', (evt: any, fileInfo: any) => {
      if (fileInfo.file.filePaths[0]) {
        const wfConfigFilePath = fileInfo.file.filePaths[0];

        Core.install(StoreType.Electron, wfConfigFilePath).then(() => {
          fetchWorkflows();
        });
      } else {
        setSpinning(false);
      }
    });
  };

  const addNewWorkflow = () => {
    // Add new workflow through npm or git
  };

  const deleteSelectedWorkflow = (workflowList: any, idxToRemove: number) => {
    const workflowBundleIds = Object.keys(workflowList);
    if (workflowBundleIds.length === 0) return;

    setSpinning(true);

    Core.unInstall({
      storeType: StoreType.Electron,
      bundleId: workflowList[workflowBundleIds[idxToRemove]].bundleId
    }).then(() => {
      const temp = workflowList;
      delete temp[workflowList[workflowBundleIds[idxToRemove]].bundleId];
      setWorkflows(temp);

      if (idxToRemove !== 0) {
        setSelectedWorkflowIdx(idxToRemove - 1);
      } else {
        forceUpdate();
      }
      setSpinning(false);
    });
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

    ipcRenderer.send('open-yesno-dialog', {
      msg: `Are you sure you want to delete '${workflowBundleId}'?`,
      icon: getDefaultIcon(workflowBundleId)
    });
    ipcRenderer.on('open-yesno-dialog-ret', (e, { yesPressed }) => {
      if (yesPressed) {
        deleteWorkflowEventHandler.current();
      }
    });
  };

  const renderEmptyList = () => {
    return (
      <EmptyListContainer>
        <CgSmileNone style={emptyListIconStyle} />
        <EmptyListDesc>There is no workflow to show.</EmptyListDesc>
      </EmptyListContainer>
    );
  };

  return (
    <OuterContainer>
      {spinning && <Spinner center />}
      <WorkflowListView>
        <Header
          style={{
            marginLeft: 40
          }}
        >
          Installed Workflows
        </Header>
        <WorkflowListOrderedList>
          <FlatList
            list={Object.keys(workflows)}
            renderItem={renderItem}
            renderWhenEmpty={renderEmptyList}
          />
        </WorkflowListOrderedList>
        <WorkflowListViewFooter>
          <AiOutlineFileAdd
            className="workflow-page-buttons"
            style={bottomFixedBarIconStyle}
            onClick={() => addNewWorkflowByFile()}
          />
          <AiOutlineAppstoreAdd
            className="workflow-page-buttons"
            style={bottomFixedBarIconStyle}
            onClick={() => addNewWorkflow()}
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
            marginLeft: 20
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
                onChange={() => {}}
              />
              Enabled
            </Label>
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Name</Label>
            <StyledInput type="text" value={workflowName} onChange={() => {}} />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Version</Label>
            <StyledInput
              type="text"
              value={workflowVersion}
              onChange={() => {}}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Creator</Label>
            <StyledInput
              type="text"
              value={workflowCreator}
              onChange={() => {}}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Bundle Id</Label>
            <StyledInput
              type="text"
              value={workflowBundleId}
              onChange={() => {}}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Category</Label>
            <StyledInput
              type="text"
              value={workflowCategory}
              onChange={() => {}}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Description</Label>
            <StyledInput
              type="textarea"
              value={workflowDescription}
              onChange={() => {}}
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Web site</Label>
            <StyledInput
              type="url"
              value={workflowWebsite}
              onChange={() => {}}
            />
          </FormGroup>
        </Form>
      </WorkflowDescContainer>
    </OuterContainer>
  );
}
