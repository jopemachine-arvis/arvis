/* eslint-disable no-restricted-syntax */
import React, { useCallback, useEffect } from 'react';
import { Core } from 'arvis-core';
import useForceUpdate from 'use-force-update';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { ipcRenderer } from 'electron';

const transformStore = (store: any[]): any[] => {
  const items = store.map((item) => {
    return {
      title: item.title || item.command,
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
  const forceUpdate = useForceUpdate();

  const setWorkflowCommandItems = useCallback(() => {
    const commands = Core.findWorkflowCommands();
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

  useEffect(() => {
    loadWorkflowsInfo();
  }, []);

  useEffect(() => {
    if (mode === 'universalAction') {
      renewHandler.current();
      setWorkflowCommandItems();
    }
  }, [mode]);
};

export default useUniversalAction;
