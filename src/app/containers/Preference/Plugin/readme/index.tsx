/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

type IProps = {
  readme: any;
};

const OuterContainer = styled.div`
  margin-top: 8px;
  background-color: #202228;
  position: absolute;
  border-radius: 10px;
  width: 50%;
  height: 70%;
  overflow-y: auto;

  .markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
    color: #fff !important;
  }
`;

export default function READMETable(props: IProps) {
  const { readme } = props;

  return (
    <OuterContainer>
      <ReactMarkdown className="markdown-body">{readme}</ReactMarkdown>
    </OuterContainer>
  );
}
