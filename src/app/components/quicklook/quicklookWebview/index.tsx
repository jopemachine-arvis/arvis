/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import encodeUrl from 'encodeurl';
import _ from 'lodash';
import isUrl from 'is-url';
import { shell } from 'electron';

const OuterContainer = styled.div`
  flex-direction: column;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  #webview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    display: inline-flex !important;
    padding: 0px;
  }
`;

// Simulating mobile phone
const userAgent =
  'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19';

type IProps = {
  data: string;
  visible: boolean;
};

export function QuicklookWebview(props: IProps) {
  const { data } = props;
  const { visible } = props;

  let src = data;
  const preventFocus = (e: any) => {
    // Focus always should be on searchBar.
    e.preventDefault();
    (document.getElementById('searchBar') as HTMLInputElement).focus();
  };

  useEffect(() => {
    if (!visible) return;
    const webview = document.querySelector('webview');
    webview!.addEventListener('did-start-loading', preventFocus);
    webview!.addEventListener('did-finish-loading', preventFocus);

    webview!.addEventListener('will-navigate', (e) => {
      if ((e as any).url !== src) {
        shell.openExternal((e as any).url);
      }
    });
  }, []);

  if (isUrl(data)) {
    src = encodeUrl(data.split(' ').join('%20'));
  }

  return (
    <OuterContainer>
      {visible && !_.isUndefined(data) && (
        <webview
          id="webview"
          useragent={userAgent}
          src={src}
          onFocus={preventFocus}
          onBlur={preventFocus}
          allowFullScreen={false}
          style={{
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
          }}
        />
      )}
    </OuterContainer>
  );
}
