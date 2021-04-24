/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Core } from 'wf-creator-core';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import FlatList from 'flatlist-react';
import { ipcRenderer } from 'electron';
import path from 'path';
import useForceUpdate from 'use-force-update';

import {
  AiOutlineAppstoreAdd,
  AiOutlineDelete,
  AiOutlineFileAdd
} from 'react-icons/ai';

import { CgSmileNone } from 'react-icons/cg';

const bottomFixedBarIconStyle = {
  width: 22,
  height: 22,
  marginLeft: 24
};

const emptyListIconStyle = {
  width: 35,
  height: 35
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
      const selectFileName = selectedConfigFilePath.split(path.sep).pop();
      const selectedFileExt = selectFileName.split('.')[1];
      if (selectedFileExt !== 'json') {
        return;
      }

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
      <WorkflowDescContainer />
    </OuterContainer>
  );
}

const EmptyListDesc = styled.div`
  margin-left: 11px;
`;

const EmptyListContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;

const WorkflowItemTitle = styled.div`
  color: #ffffff;
`;

const WorkflowItemCreatorText = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #cccccc;
`;

const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #444444;
  justify-content: flex-start;
`;

const WorkflowListView = styled.div`
  overflow-y: auto;
  width: 50%;
  background-color: #555555;
`;

const WorkflowListViewFooter = styled.div`
  overflow-y: auto;
  width: 100vh;
  height: 65px;
  background-color: #222222;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const WorkflowListOrderedList = styled.ol``;

const WorkflowItemContainer = styled.div`
  width: 300px;
  height: 45px;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const WorkflowDescContainer = styled.div`
  background-color: #888888;
  width: 50%;
`;
