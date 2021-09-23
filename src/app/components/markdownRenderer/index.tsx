/* eslint-disable promise/no-nesting */

import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import rehypeRaw from 'rehype-raw';
// To do:: Replace below css with 'github-markdown-css' dark theme file after dark theme PR is merged
import '../../../external/github-markdown-css/dark.css';

type IProps = {
  width: number | string;
  height: number | string;
  data: string;
  dark?: boolean;
  padding?: number;
  style?: any;
};

// Overwrite existing app's styles
const OuterContainer = styled(({ padding, children, ...rest }) => (
  <div {...rest}>{children}</div>
))`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-x: hidden !important;
  overflow-y: scroll !important;

  word-wrap: break-word !important;
  word-break: break-word !important;

  ::-webkit-scrollbar {
    width: 7px;
    background: #fff !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #888 !important;
  }

  .markdown-body {
    box-sizing: border-box;
    margin: 0 auto;
    min-width: 200px;
    max-width: 980px;
    padding: ${({ padding }) => padding || 0}px;
  }

  .markdown-body p {
    font-size: 100% !important;
  }

  .markdown-body li {
    list-style: disc;
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

export default function Markdown(props: IProps) {
  const { width, height, data, padding, dark } = props;
  let { style } = props;
  if (!style) style = {};

  return (
    <OuterContainer style={{ width, height, ...style }} padding={padding}>
      <ReactMarkdown
        className={dark ? 'markdown-body-dark' : 'markdown-body'}
        rehypePlugins={[rehypeRaw]}
        skipHtml={false}
      >
        {/* data might be error object or something when error occured */}
        {/* eslint-disable-next-line no-nested-ternary */}
        {typeof data === 'string'
          ? data
          : (data as any).toString
          ? (data as any).toString()
          : 'Data is not valid!'}
      </ReactMarkdown>
    </OuterContainer>
  );
}
