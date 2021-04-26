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
  width: 65%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1f2227;
`;

export const PreviewMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 5%;
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
  width: 35%;
  padding-left: 15px;
`;
