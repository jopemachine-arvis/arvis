import styled from 'styled-components';

export const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #16181b;
  justify-content: flex-start;
`;

export const PreviewContainer = styled.div`
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

export const ConfigContainer = styled.div`
  width: 50%;
  padding-left: 15px;
`;
