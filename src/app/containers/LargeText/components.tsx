import styled from 'styled-components';

export const OuterContainer = styled.div`
  align-items: center;
  background-color: #111111cc;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: scroll;
  text-align: center;
  width: 100%;
  word-break: break-word;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 15px;
  -webkit-app-region: drag;
`;

export const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: none;
`;
