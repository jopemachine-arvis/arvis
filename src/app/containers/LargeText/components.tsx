import styled from 'styled-components';

export const OuterContainer = styled.div`
  align-items: center;
  background-color: #111111cc;
  border-radius: 15px;
  color: #fff;
  cursor: move;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  word-break: break-word;
  -webkit-app-region: drag;
`;

export const InnerContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  cursor: text;
  overflow-y: scroll;
  -webkit-app-region: none;
`;
