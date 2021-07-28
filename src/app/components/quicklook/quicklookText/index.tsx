import React from 'react';
import styled from 'styled-components';

const OuterContainer = styled.div`
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: #000;
  display: flex;
  padding: 15px;
  overflow-x: hidden;
  overflow-y: scroll !important;
  align-items: left;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const QuicklookText = (props: any) => {
  const { children } = props;
  return <OuterContainer>{children}</OuterContainer>;
};
