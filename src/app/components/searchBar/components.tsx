import styled from 'styled-components';

export const Input = styled.input`
  font-weight: normal;
  height: 100%;
  width: 100%;
  border-width: 0px;
  z-index: 100;
`;

export const AutoMatch = styled.span`
  position: absolute;
`;

export const OuterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Dragger = styled.img`
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  width: 18px;
  height: 18px;
  user-select: none;
  -webkit-app-region: drag;
`;
