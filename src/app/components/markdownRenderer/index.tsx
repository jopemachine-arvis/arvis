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
import 'github-markdown-css';

type IProps = {
  width: string;
  height: string;
  data: string;
  dark?: boolean;
  padding?: number;
  style?: any;
};

export default function Markdown(props: IProps) {
  const { width, height, data, padding, dark } = props;
  let { style } = props;
  if (!style) style = {};

  const OuterContainer = styled.div`
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
      padding: ${padding || 0}px;
      color: ${dark ? '#fff' : '#000'};
    }

    .markdown-body h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
      color: ${dark ? '#fff' : '#000'} !important;
    }

    .markdown-body p {
      font-size: 100% !important;
    }

    .markdown-body pre {
      background-color: ${dark ? '#111' : '#f6f8fa'};
    }
  `;

  return (
    <OuterContainer style={{ width, height, ...style }}>
      <ReactMarkdown className="markdown-body" skipHtml={false}>
        {data}
      </ReactMarkdown>
    </OuterContainer>
  );
}
