import chokidar, { FSWatcher } from 'chokidar';
import { Core } from 'arvis-core';
import path from 'path';
import chalk from 'chalk';
import fse from 'fs-extra';
import { IPCMainEnum } from '../ipc/ipcEventEnum';
import {
  workflowWatchPaths,
  pluginWatchPaths,
  arvisRenewExtensionFlagFilePath,
} from '../config/path';
import { sleep } from '../utils';
import { WindowManager } from '../windows';

let workflowWatcher: FSWatcher | null;
let pluginWatcher: FSWatcher | null;
let otherFilesWatcher: FSWatcher | null;

const watchOpts = {
  disableGlobbing: false,
  // To do:: Change below to true after chokidar followSymlink issue is resolved
  followSymlinks: false,
  ignoreInitial: true,
  persistent: true,
};

/**
 * @param bundleIds?
 * @summary Update store of each singletons for each renderer processes
 */
const requestReloadWorkflows = (bundleIds?: string[]) => {
  const windowManager = WindowManager.getInstance();
  windowManager.getSearchWindow().webContents.send(IPCMainEnum.reloadWorkflow, {
    bundleIds: JSON.stringify(bundleIds),
  });

  windowManager
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.reloadWorkflow, {
      bundleIds: JSON.stringify(bundleIds),
    });
};

/**
 * @param bundleIds?
 * @summary Update store of each singletons for each renderer processes
 */
const requestReloadPlugins = (bundleIds?: string[]) => {
  const windowManager = WindowManager.getInstance();

  windowManager.getSearchWindow().webContents.send(IPCMainEnum.reloadPlugin, {
    bundleIds: JSON.stringify(bundleIds),
  });
  windowManager
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.reloadPlugin, {
      bundleIds: JSON.stringify(bundleIds),
    });
};

/**
 * @param changedFilePath
 */
const getBundleIdFromFilePath = (changedFilePath: string) => {
  return changedFilePath.split(path.sep)[0];
};

const reloadFlagHandler = async (filePath: string) => {
  if (filePath.endsWith('arvis-extension-renew')) {
    console.log(
      chalk.greenBright(
        `"${arvisRenewExtensionFlagFilePath}" detected. Reload extensions..`
      )
    );

    try {
      const flagInfo = await fse.readJSON(arvisRenewExtensionFlagFilePath);
      if (!flagInfo.targets || !flagInfo.type) throw new Error();

      if (flagInfo.type === 'workflow') {
        setTimeout(() => requestReloadWorkflows(flagInfo.targets), 1000);
      } else if (flagInfo.type === 'plugin') {
        setTimeout(() => requestReloadPlugins(flagInfo.targets), 1000);
      } else {
        setTimeout(() => {
          requestReloadWorkflows();
          requestReloadPlugins();
        }, 1000);
      }
    } catch (err) {
      setTimeout(() => {
        requestReloadWorkflows();
        requestReloadPlugins();
      }, 1000);
    } finally {
      await fse.remove(arvisRenewExtensionFlagFilePath);
    }
  }
};

const workflowChangeHandler = async (filePath: string) => {
  if (filePath.endsWith('arvis-workflow.json')) {
    console.log(
      chalk.greenBright(`"${filePath}" changed. Reload workflows settings..`)
    );
    await sleep(1000);
    requestReloadWorkflows([getBundleIdFromFilePath(filePath)]);
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
    requestReloadPlugins([getBundleIdFromFilePath(filePath)]);
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

  otherFilesWatcher = chokidar
    .watch([arvisRenewExtensionFlagFilePath], {
      cwd: Core.path.installedDataPath,
      ...watchOpts,
      ignoreInitial: false,
    })
    .on('add', reloadFlagHandler);
};

/**
 * @summary
 */
export const stopFileWatcher = () => {
  if (!workflowWatcher || !pluginWatcher || !otherFilesWatcher) {
    console.error('workflowWatcher is not running');
    return;
  }

  console.log(chalk.whiteBright('File watching is paused...'));

  workflowWatcher.close();
  pluginWatcher.close();
  otherFilesWatcher.close();
};
