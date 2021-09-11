import React from 'react';
import _ from 'lodash';
import open from 'open';
import { Button } from 'reactstrap';
import * as style from './style';

type IProps = {
  url?: string;
};

export default function Webview(props: IProps) {
  const { url } = props;

  if (url) {
    return (
      <>
        <webview
          id="webview"
          src={url}
          allowFullScreen={false}
          style={{
            marginTop: 16,
            width: '90%',
            height: '100%',
          }}
        />
        <Button size="sm" style={style.openWebButton} onClick={() => open(url)}>
          Open with your browser
        </Button>
      </>
    );
  }

  return <div>There is no web address</div>;
}

Webview.defaultProps = {
  url: undefined,
};
