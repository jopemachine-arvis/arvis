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
  font-size: 14px;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const WorkflowItemCreatorText = styled.div`
  margin-top: 3px;
  font-size: 10px;
  color: #aaa;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #12151a;
  justify-content: flex-start;
`;

export const WorkflowListView = styled.div`
  overflow-y: auto;
  margin-top: 95px;
`;

export const Header = styled.div`
  position: absolute;
  margin-top: 25px;
  height: 70px;
  color: #ffffff;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  user-select: none;
`;

export const WorkflowListViewFooter = styled.div`
  overflow-y: auto;
  height: 50px;
  background-color: #222222;
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const WorkflowListOrderedList = styled.div`
  background-color: #1f2228;
  border-radius: 10px;
  margin-left: 40px;
  margin-right: 40px;
  padding-bottom: 20px;
  padding-right: 30px;
  padding-left: 30px;
  padding-top: 20px;
  overflow: auto;
  height: 78%;
`;

export const WorkflowItemContainer = styled.div`
  height: 65px;
  justify-content: center;
  align-items: center;
  padding-top: 11px;
  padding-bottom: 10px;
  padding-left: 68px;
  padding-right: 35px;
  margin-bottom: 7px;
  user-select: none;
  position: relative;
  max-width: 380px;
`;

export const EmptyItemContainer = styled.div`
  padding-left: 120px;
  padding-right: 120px;
  height: 65px;
  justify-content: center;
  align-items: center;
  user-select: none;
  position: relative;
`;

export const WorkflowDescContainer = styled.div`
  margin-top: 95px;
  flex-grow: 1;
`;

export const WorkflowImg = styled.img`
  user-select: none;
  object-fit: scale-down;
  position: absolute;
  width: 40px;
  height: 40px;
  top: 14px;
  left: 15px;
`;

export const TabNavigatorContainer = styled.div`
  width: 90%;
  height: 85%;
  margin-left: 50px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
`;

export const SearchbarContainer = styled.div`
  margin-left: 40px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #202228;
  margin-right: 40px;
  padding-left: 30px;
`;
