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
  backgroundColor: '#666666',
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

  const itemClickHandler = (idx: number) => {
    setSelectedWorkflowIdx(idx);
  };

  const renderItem = (workflowBundleId: string, idx: number) => {
    const info = workflowInfo[workflowBundleId];
    const { createdby, name, bundleId } = info;

    let optionalStyle = {};
    if (selectedWorkflowIdx === idx) {
      optionalStyle = {
        backgroundColor: '#2862DA',
        borderRadius: 10
      };
    }

    return (
      <WorkflowItemContainer
        style={optionalStyle}
        key={idx}
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
        <Header>Installed Workflows</Header>
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
        <Header>Workflow config</Header>
        <Form style={descriptionContainerStyle}>
          <FormGroup check style={formGroupStyle}>
            <Label checked style={labelStyle}>
              <Input type="checkbox" onChange={() => {}} />
              Enabled
            </Label>
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Name</Label>
            <Input type="text" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Version</Label>
            <Input type="text" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Creator</Label>
            <Input type="text" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Bundle Id</Label>
            <Input type="text" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Category</Label>
            <Input type="text" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Description</Label>
            <Input type="textarea" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Web site</Label>
            <Input type="url" />
          </FormGroup>
        </Form>
      </WorkflowDescContainer>
    </OuterContainer>
  );
}
