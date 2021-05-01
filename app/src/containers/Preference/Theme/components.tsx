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
  width: 75%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 5%;
  padding-right: 5%;
`;

export const PreviewMainContainer = styled.div`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.div`
  width: 50%;
  margin-left: 25px;
  margin-top: 20px;
  height: 60px;
  color: #ffffff;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
`;

export const ConfigContainer = styled.div`
  width: 25%;
  padding-left: 15px;
  user-select: none;
  overflow-y: auto;
  padding-bottom: 20px;
`;
