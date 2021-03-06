import styled from 'styled-components';

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
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 70px;
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
  height: 50px;
  background-color: #222222;
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const SnippetSettingContainer = styled.div`
  margin-top: 95px;
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
