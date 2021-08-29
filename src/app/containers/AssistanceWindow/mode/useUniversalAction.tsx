/* eslint-disable no-restricted-syntax */
import React, { useCallback, useEffect, useState } from 'react';
import { Core } from 'arvis-core';
import useForceUpdate from 'use-force-update';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { InfoInnerContainer } from '../components';

const transformStore = (store: any[]): any[] => {
  const items = store.map((item) => {
    return {
      title: item.title || item.command,
      command: item.command,
      icon: item.icon,
      bundleId: item.bundleId,
    };
  });

  return items;
};

/**
 */
const useUniversalAction = ({
  items,
  setItems,
  originalItems,
  setOriginalItems,
  mode,
  renewHandler,
  maxShowOnScreen,
  maxShowOnWindow,
}: {
  items: any[];
  setItems: (items: any[]) => void;
  originalItems: any[];
  setOriginalItems: (items: any[]) => void;
  mode: string | undefined;
  renewHandler: React.MutableRefObject<() => void>;
  maxShowOnScreen: number;
  maxShowOnWindow: number;
}) => {
  const [target, setTarget] = useState<string>('');

  const forceUpdate = useForceUpdate();

  const setWorkflowCommandItems = useCallback(() => {
    const commands = Core.findWorkflowCommands().filter(
      (command) => command.argType !== 'no'
    );

    setItems(transformStore(commands).slice(0, maxShowOnWindow));
    setOriginalItems(transformStore(commands));

    forceUpdate();
  }, [maxShowOnWindow]);

  const loadWorkflowsInfo = useCallback(() => {
    return Core.reloadWorkflows().catch((err) => {
      ipcRenderer.send(IPCRendererEnum.showNotification, {
        title: err.name,
        body: err.message,
      });
      console.error(err);
    });
  }, []);

  const ipcCallbackTbl = {
    captureUniversalActionTarget: (
      e: IpcRendererEvent,
      { target: targetToSet }: { target: string }
    ) => {
      setTarget(targetToSet);
    },
  };

  useEffect(() => {
    ipcRenderer.on(
      IPCMainEnum.captureUniversalActionTarget,
      ipcCallbackTbl.captureUniversalActionTarget
    );

    return () => {
      ipcRenderer.off(
        IPCMainEnum.captureUniversalActionTarget,
        ipcCallbackTbl.captureUniversalActionTarget
      );
    };
  }, []);

  useEffect(() => {
    loadWorkflowsInfo();
  }, []);

  useEffect(() => {
    if (mode === 'universalAction') {
      setWorkflowCommandItems();

      setTimeout(() => {
        renewHandler.current();
      }, 50);
    }
  }, [mode]);

  const renderInfoContent = () => (
    <InfoInnerContainer id="universalActionTarget">{target}</InfoInnerContainer>
  );

  return { renderInfoContent };
};

export default useUniversalAction;
