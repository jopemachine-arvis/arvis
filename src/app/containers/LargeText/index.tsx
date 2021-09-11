import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { isWithCtrlOrCmd } from '@utils/index';
import useKey from '../../../external/use-key-capture/src';
import { InnerContainer, OuterContainer } from './components';

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
    if (isWithCtrlOrCmd({ isWithCmd: e.metaKey, isWithCtrl: e.ctrlKey })) {
      if (e.deltaY > 0) {
        setFontSize(fontSize + 1);
      } else {
        setFontSize(fontSize - 1);
      }
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
    <OuterContainer onWheel={onWheelEventHandler}>
      {text && (
        <InnerContainer
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
