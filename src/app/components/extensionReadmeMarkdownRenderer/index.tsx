import React, { useEffect } from 'react';
import _ from 'lodash';
import pAny from 'p-any';
import { getGithubReadmeContent } from '@utils/getGithubReadme';
import { Core } from 'arvis-core';
import MarkdownRenderer from '../markdownRenderer';

type IProps = {
  readme: string;
  type: 'workflow' | 'plugin';
  setReadme: (readme: string) => void;
  useAutoFetch: boolean;
  extensionInfo: any;
};

export default function Markdown(props: IProps) {
  const { readme, setReadme, type, useAutoFetch, extensionInfo } = props;

  const fetchAndSetReadme = () => {
    if (!useAutoFetch || !extensionInfo) return;

    const { bundleId, creator, name, readme: readmeStr } = extensionInfo;

    if (readmeStr) {
      setReadme(readmeStr);
    } else {
      pAny([
        getGithubReadmeContent(creator, name),
        getGithubReadmeContent(`arvis-${type}s`, name),
      ])
        .then((readmeContent) => {
          setReadme(readmeContent);
          Core.overwriteExtensionInfo(type, bundleId!, 'readme', readmeContent);
          return null;
        })
        .catch((err) => {
          if (err.status === 404) {
            setReadme('Readme data not found.');
            return;
          }
          if (err.status === 403) {
            setReadme('Rate limit exceeded. Please try again later.');
            return;
          }
          console.error(err);
        });
    }
  };

  useEffect(() => {
    fetchAndSetReadme();
  }, [extensionInfo]);

  return (
    <MarkdownRenderer
      width="50%"
      height="70%"
      dark
      style={{
        marginTop: 8,
        borderRadius: 10,
        padding: 45,
        backgroundColor: '#0D1118',
      }}
      data={readme}
    />
  );
}
