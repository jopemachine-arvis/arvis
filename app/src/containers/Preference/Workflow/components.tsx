import styled from 'styled-components';

export const EmptyListDesc = styled.div`
  margin-left: 11px;
`;

export const EmptyListContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;

export const WorkflowItemTitle = styled.div`
  color: #ffffff;
`;

export const WorkflowItemCreatorText = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #cccccc;
`;

export const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #555555;
  justify-content: flex-start;
`;

export const WorkflowListView = styled.div`
  overflow-y: auto;
  width: 50%;
`;

export const Header = styled.div`
  width: 50%;
  margin-left: 45px;
  margin-top: 25px;
  height: 70px;
  color: #ffffff;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
`;

export const WorkflowListViewFooter = styled.div`
  overflow-y: auto;
  width: 100vh;
  height: 65px;
  background-color: #222222;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const WorkflowListOrderedList = styled.ol`
  background-color: #666666;
  margin-left: 25px;
  margin-right: 25px;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

export const WorkflowItemContainer = styled.div`
  width: 300px;
  height: 65px;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  margin-bottom: 7px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
`;

export const WorkflowDescContainer = styled.div`
  width: 50%;
  padding-left: 15px;
`;
