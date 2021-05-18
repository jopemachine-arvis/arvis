/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPCMainEnum, IPCRendererEnum } from '../../ipc/ipcEventEnum';
import useKey from '../../../use-key-capture/src';

const OuterContainer = styled.div`
  align-items: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 32px;
  height: 100vh;
  justify-content: center;
  overflow-y: auto;
  text-align: center;
  width: 100%;
  background-color: #111111cc;
`;

export default function LargeTextWindow() {
  const [text, setText] = useState<string>('');
  const { keyData } = useKey();

  const ipcCallbackTbl = {
    forwardLargeText: (
      e: IpcRendererEvent,
      { text: textToSet }: { text: string }
    ) => {
      setText(textToSet);
    },
  };

  useEffect(() => {
    ipcRenderer.on(
      IPCMainEnum.forwardLargeText,
      ipcCallbackTbl.forwardLargeText
    );
    return () => {
      ipcRenderer.off(
        IPCMainEnum.forwardLargeText,
        ipcCallbackTbl.forwardLargeText
      );
    };
  }, []);

  useEffect(() => {
    if (keyData.isEscape) {
      ipcRenderer.send(IPCRendererEnum.hideLargeTextWindow);
    }
  }, [keyData]);

  return <OuterContainer>{text}</OuterContainer>;
}
