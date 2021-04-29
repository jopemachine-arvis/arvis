/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useContext, useEffect, useState } from 'react';
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

import './index.global.css';

export default function Workflow() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  // object with bundleId as key and workflow info in value
  const [workflowInfo, setWorkflowInfo] = useState<any>({});
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState<number>(0);

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
        setWorkflowInfo(workflowsToSet);
        setWorkflows(Object.keys(workflowsToSet));
        return null;
      })
      .catch((err: any) => console.error(err));
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    if (Object.keys(workflowInfo).length >= 1) {
      const info = workflowInfo[workflows[selectedWorkflowIdx]];
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
  }, [selectedWorkflowIdx, workflows]);

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

  const renderItem = (itemBundleId: string, idx: number) => {
    const info = workflowInfo[itemBundleId];
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
        const selectedConfigFilePath = fileInfo.file.filePaths[0];

        Core.install(StoreType.Electron, selectedConfigFilePath).then(() => {
          fetchWorkflows();
          setSpinning(false);
        });
      } else {
        setSpinning(false);
      }
    });
  };

  const addNewWorkflow = () => {
    // Add new workflow through npm or git
  };

  const deleteSelectedWorkflow = () => {
    if (workflows.length === 0) return;

    setSpinning(true);

    Core.unInstall(
      StoreType.Electron,
      workflowInfo[workflows[selectedWorkflowIdx]].bundleId
    ).then(() => {
      const temp = workflows;
      workflows.splice(selectedWorkflowIdx, 1);
      setWorkflows(temp);
      if (workflows.length !== 0) {
        setSelectedWorkflowIdx(selectedWorkflowIdx - 1);
      } else {
        forceUpdate();
      }
      setSpinning(false);
    });
  };

  const callDeleteWorkflowConfModal = () => {
    ipcRenderer.send('open-yesno-dialog', {
      msg: `Are you sure you want to delete '${workflowBundleId}'?`,
      icon: getDefaultIcon(workflowBundleId)
    });
    ipcRenderer.on('open-yesno-dialog-ret', (e, { yesPressed }) => {
      if (yesPressed) {
        deleteSelectedWorkflow();
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
            list={workflows}
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
            <StyledInput type="text" value={workflowName} />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Version</Label>
            <StyledInput type="text" value={workflowVersion} />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Creator</Label>
            <StyledInput type="text" value={workflowCreator} />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Bundle Id</Label>
            <StyledInput type="text" value={workflowBundleId} />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Category</Label>
            <StyledInput type="text" value={workflowCategory} />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Description</Label>
            <StyledInput type="textarea" value={workflowDescription} />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Web site</Label>
            <StyledInput type="url" value={workflowWebsite} />
          </FormGroup>
        </Form>
      </WorkflowDescContainer>
    </OuterContainer>
  );
}
