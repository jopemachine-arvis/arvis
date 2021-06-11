import styled from 'styled-components';

export const OuterContainer = styled.div`
  align-items: center;
  background-color: #111111ee;
  color: #fff;
  display: flex;
  flex-direction: row;
  flex: 1;
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

export const InfoContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const InfoInnerContainer = styled.pre`
  font-size: 12px;
  height: 94%;
  color: #fff;
  display: flex;
  padding: 15px;
  overflow-x: hidden;
  user-select: text !important;
  text-align: left;
  white-space: pre-wrap;
  -webkit-app-region: none;
`;

export const CopyDateTime = styled.div`
  height: 6%;
  display: flex;
  font-size: 12px;
  bottom: 15px;
  color: #888888;
  justify-content: center;
  align-items: center;
`;
