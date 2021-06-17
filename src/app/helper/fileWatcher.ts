import chokidar, { FSWatcher } from 'chokidar';
import { Core } from 'arvis-core';
import path from 'path';
import chalk from 'chalk';
import { IPCMainEnum } from '../ipc/ipcEventEnum';
import { sleep } from '../utils';
import { WindowManager } from '../windows';

let workflowWatcher: FSWatcher | null;
let pluginWatcher: FSWatcher | null;

const watchOpts = {
  disableGlobbing: false,
  followSymlinks: false,
  ignoreInitial: true,
  persistent: true,
  // awaitWriteFinish: {
  //   pollInterval: 100,
  //   stabilityThreshold: 2000,
  // },
};

const workflowWatchPaths = [
  `${Core.path.workflowInstallPath}${path.sep}*${path.sep}arvis-workflow.json`,
];

// Detects only changes to plugin root folder files to save system resources
const pluginWatchPaths = [
  `${Core.path.pluginInstallPath}${path.sep}*${path.sep}*.js`,
  `${Core.path.pluginInstallPath}${path.sep}*${path.sep}arvis-plugin.json`,
];

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
 * @param  {string} changedFilePath
 */
const getBundleIdFromFilePath = (changedFilePath: string) => {
  return changedFilePath.split(path.sep)[0];
};

const workflowChangeHandler = async (filePath: string) => {
  if (filePath.endsWith('arvis-workflow.json')) {
    console.log(
      chalk.greenBright(`"${filePath}" changed. Reload workflows settings..`)
    );
    await sleep(1000);
    requestRenewWorkflows(getBundleIdFromFilePath(filePath));
  } else {
    console.log(
      chalk.magenta(
        `"${filePath}" change detected.. there might be wrong regexp in filewatcher..`
      )
    );
  }
};

const pluginChangeHandler = async (filePath: string) => {
  if (filePath.endsWith('arvis-plugin.json') || filePath.endsWith('.js')) {
    console.log(
      chalk.greenBright(`"${filePath}" changed. Reload plugins settings..`)
    );
    await sleep(1000);
    requestRenewPlugins(getBundleIdFromFilePath(filePath));
  } else {
    console.log(
      chalk.magenta(
        `"${filePath}" change detected.. there might be wrong regexp in filewatcher..`
      )
    );
  }
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
export const startFileWatcher = () => {
  console.log(chalk.whiteBright('Start file watching...'));

  workflowWatcher = chokidar
    .watch(workflowWatchPaths, {
      cwd: Core.path.workflowInstallPath,
      ...watchOpts,
    })
    .on('change', workflowChangeHandler)
    .on('unlink', workflowChangeHandler)
    .on('add', workflowChangeHandler);

  pluginWatcher = chokidar
    .watch(pluginWatchPaths, {
      cwd: Core.path.pluginInstallPath,
      ...watchOpts,
    })
    .on('change', pluginChangeHandler)
    .on('unlink', pluginChangeHandler)
    .on('add', pluginChangeHandler);
};

/**
 * @summary
 */
export const stopFileWatcher = () => {
  if (!workflowWatcher || !pluginWatcher) {
    console.error('workflowWatcher is not running');
    return;
  }

  console.log(chalk.whiteBright('File watching is paused...'));

  workflowWatcher.close();
  pluginWatcher.close();
};
