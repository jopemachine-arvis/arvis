/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import encodeUrl from 'encodeurl';
import _ from 'lodash';
import isUrl from 'is-url';
import { remote, shell } from 'electron';

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

// Simulating mobile phone if possible
const userAgent =
  'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19';

type IProps = {
  data: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export function QuicklookWebview(props: IProps) {
  const { data, visible, setVisible } = props;
  const visibleRef = useRef<boolean>(visible);

  let src = data;
  const preventFocus = (e: any) => {
    // Focus always should be on searchBar.
    e.preventDefault();
    (document.getElementById('searchBar') as HTMLInputElement).focus();
  };

  const emulateKeyboardEvent = (e: any, input: any) => {
    if (input.type !== 'keyDown') {
      return;
    }

    // Create a fake KeyboardEvent from the data provided
    const ev = new KeyboardEvent('keydown', {
      code: input.code,
      key: input.key,
      shiftKey: input.shift,
      altKey: input.alt,
      ctrlKey: input.control,
      metaKey: input.meta,
      repeat: input.isAutoRepeat,
    });

    if (visibleRef.current && ev.shiftKey && ev.key === ' ') {
      setVisible(false);
    }
  };

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const webview = document.querySelector('webview');

    webview!.addEventListener('did-start-loading', preventFocus);
    webview!.addEventListener('did-finish-loading', preventFocus);

    webview!.addEventListener('dom-ready', () => {
      const webviewContents = remote.webContents.fromId(
        (webview! as any).getWebContentsId()
      );
      webviewContents.on('before-input-event', emulateKeyboardEvent);
      webviewContents.on('new-window', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      });
    });
  }, []);

  if (isUrl(data)) {
    src = encodeUrl(data.split(' ').join('%20'));
  }

  return (
    <OuterContainer>
      {visible && !_.isUndefined(data) && (
        <webview
          // allowpopups
          // disablewebsecurity
          autoFocus={false}
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
          }}
        />
      )}
    </OuterContainer>
  );
}
