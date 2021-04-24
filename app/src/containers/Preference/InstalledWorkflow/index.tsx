import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Core } from 'wf-creator-core';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import FlatList from 'flatlist-react';
import { ipcRenderer } from 'electron';
import path from 'path';

import {
  AiOutlineAppstoreAdd,
  AiOutlineDelete,
  AiOutlineFileAdd
} from 'react-icons/ai';

export default function InstalledWorkflow() {
  const [workflows, setWorkflows] = useState<any[]>();
  const [workflowInfo, setWorkflowInfo] = useState<any>();
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState<number>(0);

  useEffect(() => {
    Core.getWorkflowList(StoreType.Electron)
      .then((workflowsToSet: object) => {
        setWorkflowInfo(workflowsToSet);
        setWorkflows(Object.keys(workflowsToSet));
        return null;
      })
      .catch(err => console.error(err));
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
        backgroundColor: '#000000'
      };
    }

    return (
      <WorkflowItemContainer
        style={optionalStyle}
        key={idx}
        onClick={() => itemClickHandler(idx)}
      >
        <div>{name}</div>
        <div>{createdby}</div>
      </WorkflowItemContainer>
    );
  };

  const bottomFixedBarIconStyle = {
    width: 21,
    height: 21,
    marginLeft: 15
  };

  const addNewWorkflowByFile = () => {
    ipcRenderer.send('open-wfconf-file-dialog');
    ipcRenderer.on('open-wfconf-file-dialog-ret', (evt: any, fileInfo: any) => {
      const selectedConfigFilePath = fileInfo.file.filePaths[0];
      const selectFileName = selectedConfigFilePath.split(path.sep).pop();
      if (selectFileName.split('.')[1] !== 'json') {
        return;
      }

      Core.install(StoreType.Electron, selectedConfigFilePath);
    });
  };

  const addNewWorkflow = () => {
    // Add new workflow through npm or git
  };

  const deleteSelectedWorkflow = () => {
    Core.unInstall(
      StoreType.Electron,
      (workflowInfo as any)[selectedWorkflowIdx].bundleId
    );
  };

  return (
    <OuterContainer>
      <WorkflowListView>
        <WorkflowListOrderedList>
          <FlatList
            list={workflows}
            renderItem={renderItem}
            renderWhenEmpty={() => <div>List is empty!</div>}
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

const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #444444;
  justify-content: flex-start;
  margin-left: 15px;
`;

const WorkflowListView = styled.div`
  overflow-y: auto;
  width: 50%;
  background-color: #555555;
`;

const WorkflowListViewFooter = styled.div`
  overflow-y: auto;
  width: 100vh;
  height: 40px;
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
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #777777;
`;

const WorkflowDescContainer = styled.div`
  background-color: #888888;
  width: 50%;
`;
