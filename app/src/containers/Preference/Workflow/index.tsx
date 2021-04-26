/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useEffect, useState } from 'react';
import { Core } from 'wf-creator-core';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import FlatList from 'flatlist-react';
import { ipcRenderer } from 'electron';
import useForceUpdate from 'use-force-update';

import {
  AiOutlineAppstoreAdd,
  AiOutlineDelete,
  AiOutlineFileAdd
} from 'react-icons/ai';

import { CgSmileNone } from 'react-icons/cg';

import { Form, FormGroup, Label, Input } from 'reactstrap';
import {
  EmptyListContainer,
  EmptyListDesc,
  OuterContainer,
  WorkflowDescContainer,
  WorkflowItemContainer,
  WorkflowItemCreatorText,
  WorkflowItemTitle,
  WorkflowListOrderedList,
  WorkflowListView,
  Header,
  WorkflowListViewFooter
} from './components';

import { StyledInput } from '../../../components';

const bottomFixedBarIconStyle = {
  width: 22,
  height: 22,
  marginLeft: 24
};

const emptyListIconStyle = {
  width: 35,
  height: 35
};

const formGroupStyle = {
  marginBottom: 15,
  width: '75%',
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const checkboxStyle = {
  marginBottom: 15,
  left: '13%',
  alignSelf: 'flex-start'
};

const labelStyle = {
  fontSize: 14,
  color: '#ffffff',
  width: 150,
  marginRight: 15
};

const descriptionContainerStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1f2228',
  paddingTop: 10,
  paddingBottom: 10,
  borderRadius: 10,
  marginLeft: 20,
  marginRight: 20
};

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

  const fetchWorkflows = () => {
    Core.getWorkflowList(StoreType.Electron)
      .then((workflowsToSet: object) => {
        setWorkflowInfo(workflowsToSet);
        setWorkflows(Object.keys(workflowsToSet));
        return null;
      })
      .catch(err => console.error(err));
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

  const renderItem = (itemBundleId: string, idx: number) => {
    const info = workflowInfo[itemBundleId];
    const { createdby, name, bundleId } = info;

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
        <WorkflowItemTitle>{name}</WorkflowItemTitle>
        <WorkflowItemCreatorText>{createdby}</WorkflowItemCreatorText>
      </WorkflowItemContainer>
    );
  };

  const addNewWorkflowByFile = () => {
    ipcRenderer.send('open-wfconf-file-dialog');
    ipcRenderer.on('open-wfconf-file-dialog-ret', (evt: any, fileInfo: any) => {
      // Cancel selecting file
      if (!fileInfo.file.filePaths[0]) return;
      const selectedConfigFilePath = fileInfo.file.filePaths[0];

      Core.install(StoreType.Electron, selectedConfigFilePath).then(() => {
        fetchWorkflows();
      });
    });
  };

  const addNewWorkflow = () => {
    // Add new workflow through npm or git
  };

  const deleteSelectedWorkflow = () => {
    if (workflows.length === 0) return;

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
            style={bottomFixedBarIconStyle}
            onClick={() => addNewWorkflowByFile()}
          />
          <AiOutlineAppstoreAdd
            style={bottomFixedBarIconStyle}
            onClick={() => addNewWorkflow()}
          />
          <AiOutlineDelete
            style={bottomFixedBarIconStyle}
            onClick={() => deleteSelectedWorkflow()}
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
