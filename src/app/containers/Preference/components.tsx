import styled from 'styled-components';

export const OuterContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
`;

export const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: row;
  position: relative;
  overflow-y: auto;
`;
