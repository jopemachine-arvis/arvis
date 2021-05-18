/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer, IpcRendererEvent, remote } from 'electron';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPCMainEnum, IPCRendererEnum } from '../../ipc/ipcEventEnum';
import useKey from '../../../use-key-capture/src';

const OuterContainer = styled.div`
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default function QuicklookWindow() {
  const [url, setUrl] = useState<string>('');
  const { keyData } = useKey();

  const ipcCallbackTbl = {
    forwardQuicklookWindowUrl: (
      e: IpcRendererEvent,
      { url: urlToSet }: { url: string }
    ) => {
      setUrl(urlToSet);
    },
  };

  const emulatedKeyboardEvent = (event: any, input: any) => {
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

    if (ev.code === 'Escape') {
      ipcRenderer.send(IPCRendererEnum.hideQuicklookWindow);
    }
  };

  useEffect(() => {
    ipcRenderer.on(
      IPCMainEnum.forwardQuicklookWindowUrl,
      ipcCallbackTbl.forwardQuicklookWindowUrl
    );
    return () => {
      ipcRenderer.off(
        IPCMainEnum.forwardQuicklookWindowUrl,
        ipcCallbackTbl.forwardQuicklookWindowUrl
      );
    };
  }, []);

  useEffect(() => {
    const webview = document.querySelector('webview');

    webview!.addEventListener('dom-ready', () => {
      const webviewContents = remote.webContents.fromId(
        (webview! as any).getWebContentsId()
      );
      webviewContents.on('before-input-event', emulatedKeyboardEvent);
    });
  }, []);

  useEffect(() => {
    if (keyData.isEscape) {
      ipcRenderer.send(IPCRendererEnum.hideQuicklookWindow);
    }
  }, [keyData]);

  return (
    <OuterContainer>
      <webview
        id="webview"
        src={url}
        allowFullScreen={false}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </OuterContainer>
  );
}
