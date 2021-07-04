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
import gfm from 'remark-gfm';

type IProps = {
  readme: any;
};

const OuterContainer = styled.div`
  background-color: #202228;
  position: absolute;
  border-radius: 10px;
  padding: 15px;
  width: 50%;
  height: 75%;
  overflow-y: auto;
`;

export default function READMETable(props: IProps) {
  const { readme } = props;

  return (
    <OuterContainer>
      <ReactMarkdown plugins={[gfm]}>{readme}</ReactMarkdown>
    </OuterContainer>
  );
}
