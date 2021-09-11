import styled from 'styled-components';

export const OuterContainer = styled.div`
  align-items: center;
  background-color: #111111cc;
  border-radius: 15px;
  color: #fff;
  cursor: move;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  width: 100%;
  word-break: break-word;
  -webkit-app-region: drag;
`;

export const InnerContainer = styled.div`
  cursor: text;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: none;
`;
