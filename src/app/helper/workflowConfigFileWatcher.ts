import chokidar from 'chokidar';
import { Core } from 'arvis-core';
import path from 'path';
import { BrowserWindow } from 'electron';
import { IPCMainEnum } from '../ipc/ipcEventEnum';
import { sleep } from '../utils';

export const startFileWatcher = ({
  searchWindow,
  preferenceWindow,
}: {
  searchWindow: BrowserWindow;
  preferenceWindow: BrowserWindow;
}) => {
  /**
   * @param  {string} bundleId?
   * @summary Update singletons for each renderer processes
   */
  const requestRenewWorkflows = (bundleId?: string) => {
    searchWindow.webContents.send(IPCMainEnum.renewWorkflow, { bundleId });
    preferenceWindow.webContents.send(IPCMainEnum.renewWorkflow, {
      bundleId,
    });
  };

  /**
   * @param  {string} arvisWorkflowConfigFilePath
   */
  const getBundleIdFromFilePath = (arvisWorkflowConfigFilePath: string) => {
    const pathArrs = arvisWorkflowConfigFilePath.split(path.sep);
    pathArrs.pop();
    return pathArrs.pop();
  };

  /**
   * @summary Initialize watcher.
   *          It detects workflow config file change and
   *          loads new workflow config file if it detects a change.
   *
   * @description Even if there is a proper file event,
   *              should send a renew request for a second after
   *              because the change should be reflected in the in-memory store.
   */
  chokidar
    .watch(
      `${Core.path.workflowInstallPath}${path.sep}**${path.sep}arvis-workflow.json`,
      {
        persistent: true,
        ignoreInitial: true,
        followSymlinks: false,
      }
    )
    .on('change', async (filePath: string) => {
      console.log(`"${filePath}" changed. Reload workflows settings..`);
      await sleep(1000);
      requestRenewWorkflows(getBundleIdFromFilePath(filePath));
    })
    .on('unlink', async (filePath: string) => {
      console.log(`"${filePath}" unlinked. Reload workflows settings..`);
      await sleep(1000);
      requestRenewWorkflows();
    })
    .on('add', async (filePath: string) => {
      console.log(`"${filePath}" added. Reload workflows settings..`);
      await sleep(1000);
      requestRenewWorkflows();
    });
};
