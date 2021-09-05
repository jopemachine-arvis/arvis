/* eslint-disable no-restricted-syntax */
import React, { useCallback, useEffect, useState } from 'react';
import { Core } from 'arvis-core';
import useForceUpdate from 'use-force-update';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SubInfoText, InfoInnerContainer } from '../components';

const transform = (store: any[]): any[] => {
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
const useUniversalActionMode = ({
  items,
  setItems,
  originalItems,
  setOriginalItems,
  mode,
  renewHandler,
  maxShowOnScreen,
  maxShowOnWindow,
  onWindowOpenEventHandlers,
}: {
  items: any[];
  setItems: (items: any[]) => void;
  originalItems: any[];
  setOriginalItems: (items: any[]) => void;
  mode: AssistanceWindowType | undefined;
  renewHandler: React.MutableRefObject<() => void>;
  maxShowOnScreen: number;
  maxShowOnWindow: number;
  onWindowOpenEventHandlers: Map<string, () => void>;
}) => {
  const [target, setTarget] = useState<string>('');

  const forceUpdate = useForceUpdate();

  const setWorkflowCommandItems = () => {
    const commands = Core.sortByLatestUse(
      Core.findWorkflowCommands().filter((command) => command.argType !== 'no')
    );

    setItems(transform(commands).slice(0, maxShowOnWindow));
    setOriginalItems(transform(commands));

    forceUpdate();
  };

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

    reloadWorkflow: (
      e: IpcRendererEvent,
      { bundleIds }: { bundleIds: string }
    ) => {
      const targets = bundleIds ? JSON.parse(bundleIds) : undefined;

      Core.reloadWorkflows(targets);
    },
  };

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.reloadWorkflow, ipcCallbackTbl.reloadWorkflow);
    ipcRenderer.on(
      IPCMainEnum.captureUniversalActionTarget,
      ipcCallbackTbl.captureUniversalActionTarget
    );

    return () => {
      ipcRenderer.off(
        IPCMainEnum.reloadWorkflow,
        ipcCallbackTbl.reloadWorkflow
      );
      ipcRenderer.off(
        IPCMainEnum.captureUniversalActionTarget,
        ipcCallbackTbl.captureUniversalActionTarget
      );
    };
  }, []);

  const reload = () => {
    setWorkflowCommandItems();

    setTimeout(() => {
      renewHandler.current();
    }, 50);
  };

  const renderInfoContent = () => (
    <>
      <InfoInnerContainer id="universalActionTarget">
        {target}
      </InfoInnerContainer>
      <SubInfoText>
        {`${target.split(' ').length} Words, ${target.length} Characters`}
      </SubInfoText>
    </>
  );

  useEffect(() => {
    loadWorkflowsInfo();
  }, []);

  useEffect(() => {
    onWindowOpenEventHandlers.set('universalAction', reload);
  }, []);

  return { renderInfoContent };
};

export default useUniversalActionMode;
