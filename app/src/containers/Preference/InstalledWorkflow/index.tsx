import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Core } from 'wf-creator-core';
import { StoreType } from 'wf-creator-core/dist/types/storeType';
import FlatList from 'flatlist-react';

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
  width: 100%;
  height: 40px;
  background-color: #222222;
  position: fixed;
  bottom: 0;
  width: 100%;
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

export default function InstalledWorkflow() {
  const [workflows, setWorkflows] = useState<any>();
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState<number>(0);

  useEffect(() => {
    const workflowsToSet = Core.getWorkflowList(StoreType.Electron);
    setWorkflows(workflowsToSet);
  }, []);

  const itemClickHandler = (idx: number) => {
    setSelectedWorkflowIdx(idx);
  };

  const renderItem = (item: any, idx: number) => {
    let optionalStyle = {};
    if (selectedWorkflowIdx === idx) {
      optionalStyle = {
        'background-color': '#000000'
      };
    }

    return (
      <WorkflowItemContainer
        style={optionalStyle}
        key={idx}
        onClick={() => itemClickHandler(idx)}
      >
        <div>{item}</div>
      </WorkflowItemContainer>
    );
  };

  return (
    <OuterContainer>
      <WorkflowListView>
        <WorkflowListOrderedList>
          <FlatList
            list={[
              'a',
              'b',
              'c',
              'a',
              'b',
              'c',
              'a',
              'b',
              'c',
              'a',
              'b',
              'c',
              'a',
              'b',
              'c',
              'a',
              'b',
              'c'
            ]}
            renderItem={renderItem}
            renderWhenEmpty={() => <div>List is empty!</div>}
          />
        </WorkflowListOrderedList>
        <WorkflowListViewFooter />
      </WorkflowListView>
      <WorkflowDescContainer />
    </OuterContainer>
  );
}
