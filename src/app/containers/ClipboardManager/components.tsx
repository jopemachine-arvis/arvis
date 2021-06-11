import styled from 'styled-components';

export const OuterContainer = styled.div`
  align-items: center;
  background-color: #111111ee;
  color: #fff;
  display: flex;
  flex-direction: row;
  flex: 1;
  font-size: 32px;
  height: 100vh;
  justify-content: flex-start;
  overflow: hidden;
  text-align: center;
  width: 100%;
  word-break: break-word;
`;

export const SearchContainer = styled.div`
  width: 50%;
  height: 100%;
  text-align: left;
`;

export const InfoContainer = styled.pre`
  width: 50%;
  height: 100%;
  font-size: 16px;
  color: #fff;
  display: flex;
  padding: 15px;
  overflow-x: hidden;
  user-select: text !important;
  text-align: left;
`;
