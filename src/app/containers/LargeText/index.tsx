/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { isWithCtrlOrCmd } from '@utils/index';
import useKey from '../../../use-key-capture/src';

const OuterContainer = styled.div`
  align-items: center;
  background-color: #111111cc;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: scroll;
  text-align: center;
  width: 100%;
  word-break: break-word;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 15px;
  -webkit-app-region: drag;
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: none;
`;

export default function LargeTextWindow() {
  const [text, setText] = useState<string | undefined>('');
  const [fontSize, setFontSize] = useState<number>(32);
  const { keyData } = useKey();

  const ipcCallbackTbl = {
    forwardLargeText: (
      e: IpcRendererEvent,
      { text: textToSet }: { text: string }
    ) => {
      setText(textToSet);
    },
  };

  const onWheelEventHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (
      isWithCtrlOrCmd({ isWithCmd: e.metaKey, isWithCtrl: e.ctrlKey }) &&
      e.deltaY > 0
    ) {
      setFontSize(fontSize + 1);
    } else {
      setFontSize(fontSize - 1);
    }
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
    if (
      keyData.isEscape ||
      (isWithCtrlOrCmd({
        isWithCtrl: keyData.isWithCtrl,
        isWithCmd: keyData.isWithMeta,
      }) &&
        keyData.key &&
        keyData.key.toUpperCase() === 'L')
    ) {
      setText(undefined);
      ipcRenderer.send(IPCRendererEnum.hideLargeTextWindow);
    }
  }, [keyData]);

  return (
    <OuterContainer>
      {text && (
        <InnerContainer
          onWheel={onWheelEventHandler}
          id="largeText"
          style={{
            fontSize,
          }}
        >
          {text}
        </InnerContainer>
      )}
    </OuterContainer>
  );
}
