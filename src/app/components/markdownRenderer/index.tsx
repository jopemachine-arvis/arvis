/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/require-default-props */
import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

type IProps = {
  width: string;
  height: string;
  data: string;
  padding?: number;
  style?: any;
  bodyStyle?: any;
};

export default function Markdown(props: IProps) {
  const { width, height, data, padding } = props;
  const { style, bodyStyle } = props;

  const OuterContainer = styled.div`
    background-color: #202228;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-x: hidden !important;

    word-wrap: break-word !important;
    word-break: break-word !important;

    .markdown-body {
      box-sizing: border-box;
      margin: 0 auto;
      min-width: 200px;
      max-width: 980px;
      color: #fff !important;
      padding: ${padding || 0}px;
    }

    .markdown-body p {
      font-size: 100% !important;
    }

    .markdown-body pre {
      background-color: #111;
    }
  `;

  return (
    <OuterContainer style={{ width, height, ...style }}>
      <ReactMarkdown
        className="markdown-body"
        remarkPlugins={[gfm]}
        skipHtml={false}
      >
        {data}
      </ReactMarkdown>
    </OuterContainer>
  );
}
