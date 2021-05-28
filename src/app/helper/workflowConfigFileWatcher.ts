import chokidar from 'chokidar';
import { Core } from 'arvis-core';
import path from 'path';
import { IPCMainEnum } from '../ipc/ipcEventEnum';
import { sleep } from '../utils';
import { WindowManager } from '../windows';

/**
 * @summary Initialize watcher.
 *          It detects workflow config file change and
 *          loads new workflow config file if it detects a change.
 *
 * @description Even if there is a proper file event,
 *              should send a renew request for a second after
 *              because the change should be reflected in the in-memory store.
 */
export const startFileWatcher = () => {
  /**
   * @param  {string} bundleId?
   * @summary Update store of each singletons for each renderer processes
   */
  const requestRenewWorkflows = (bundleId?: string) => {
    const windowManager = WindowManager.getInstance();
    windowManager
      .getSearchWindow()
      .webContents.send(IPCMainEnum.renewWorkflow, { bundleId });

    windowManager
      .getPreferenceWindow()
      .webContents.send(IPCMainEnum.renewWorkflow, {
        bundleId,
      });
  };

  /**
   * @param  {string} bundleId?
   * @summary Update store of each singletons for each renderer processes
   */
  const requestRenewPlugins = (bundleId?: string) => {
    const windowManager = WindowManager.getInstance();

    windowManager
      .getSearchWindow()
      .webContents.send(IPCMainEnum.renewPlugin, { bundleId });
    windowManager
      .getPreferenceWindow()
      .webContents.send(IPCMainEnum.renewPlugin, {
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

  const workflowWatchPath =
    process.platform === 'win32'
      ? `${Core.path.workflowInstallPath}`
      : `${Core.path.workflowInstallPath}${path.sep}**${path.sep}arvis-workflow.json`;

  chokidar
    .watch(workflowWatchPath, {
      persistent: true,
      ignoreInitial: true,
      followSymlinks: false,
    })
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
  
  console.log('abc', `${Core.path.pluginInstallPath}`);

  const pluginWatchPath =
    process.platform === 'win32'
      ? `${Core.path.pluginInstallPath}`
      : [
        `${Core.path.pluginInstallPath}${path.sep}**${path.sep}*.js`,
        `${Core.path.pluginInstallPath}${path.sep}**${path.sep}arvis-plugin.json`,
      ];

  chokidar
    .watch(
      pluginWatchPath,
      {
        persistent: true,
        ignoreInitial: true,
        followSymlinks: false,
      }
    )
    .on('change', async (filePath: string) => {
      console.log(`"${filePath}" changed. Reload plugins settings..`);
      await sleep(1000);
      requestRenewPlugins(getBundleIdFromFilePath(filePath));
    })
    .on('unlink', async (filePath: string) => {
      console.log(`"${filePath}" unlinked. Reload plugins settings..`);
      await sleep(1000);
      requestRenewPlugins();
    })
    .on('add', async (filePath: string) => {
      console.log(`"${filePath}" added. Reload plugins settings..`);
      await sleep(1000);
      requestRenewPlugins();
    });
};
