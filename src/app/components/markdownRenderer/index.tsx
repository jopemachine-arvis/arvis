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
// To do:: Replace below css with 'github-markdown-css' dark theme file after dark theme PR is merged
import '../../../external/github-markdown-css/dark.css';

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

  // Overwrite existing app's styles
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
    }

    .markdown-body p {
      font-size: 100% !important;
    }

    .markdown-body-dark p {
      font-size: 100% !important;
    }

    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4,
    .markdown-body h5,
    .markdown-body h6 {
      color: #000 !important;
    }
  `;

  return (
    <OuterContainer style={{ width, height, ...style }}>
      <ReactMarkdown
        className={dark ? 'markdown-body-dark' : 'markdown-body'}
        skipHtml={false}
      >
        {data}
      </ReactMarkdown>
    </OuterContainer>
  );
}
