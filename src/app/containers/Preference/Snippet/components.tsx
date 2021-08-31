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

export const SnippetItemTitle = styled.div`
  font-size: 14px;
  color: #ffffff;
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

export const SnippetListView = styled.div`
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

export const SnippetListViewFooter = styled.div`
  overflow-y: auto;
  width: 100vh;
  height: 7%;
  background-color: #222222;
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const SnippetListOrderedList = styled.div`
  background-color: #1f2228;
  border-radius: 10px;
  margin-left: 40px;
  margin-right: 25px;
  padding-bottom: 20px;
  padding-right: 30px;
  padding-left: 30px;
  padding-top: 20px;
  overflow: auto;
  height: 78%;
  min-width: 380px;
  max-width: 380px;
`;

export const SnippetItemContainer = styled.div`
  height: 65px;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 68px;
  padding-right: 35px;
  margin-bottom: 7px;
  user-select: none;
  position: relative;
`;

export const SnippetSettingContainer = styled.div`
  margin-top: 95px;
  border-radius: 10px;
  flex-grow: 1;
  height: 80%;
`;

export const SnippetImg = styled.img`
  user-select: none;
  object-fit: scale-down;
  position: absolute;
  width: 40px;
  height: 40px;
  top: 14px;
  left: 15px;
`;

export const SnippetItemSubText = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #cccccc;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const TabNavigatorContainer = styled.div`
  width: 90%;
  height: 85%;
  margin-left: 50px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
`;
