import path from 'path';
import { Core } from 'arvis-core';

const workflowWatchPaths = [
  `${Core.path.workflowInstallPath}${path.sep}*${path.sep}arvis-workflow.json`,
];

// Detects only changes to plugin root folder files to save system resources
const pluginWatchPaths = [
  `${Core.path.pluginInstallPath}${path.sep}*${path.sep}*.js`,
  `${Core.path.pluginInstallPath}${path.sep}*${path.sep}arvis-plugin.json`,
];

const arvisReduxStoreResetFlagPath = path.resolve(
  Core.path.installedDataPath,
  'arvis-redux-store-reset'
);

const arvisRenewExtensionFlagFilePath = path.resolve(
  Core.path.installedDataPath,
  'arvis-extension-renew'
);

const arvisRootPath = __dirname.split(path.sep).slice(0, -1).join(path.sep);

const arvisAssetsPath = path.resolve(arvisRootPath, 'assets');

const arvisScriptsPath = path.resolve(arvisAssetsPath, 'scripts');

const scriptExecutorPath = path.resolve(arvisScriptsPath, 'execa', 'index.js');

export {
  arvisAssetsPath,
  arvisScriptsPath,
  scriptExecutorPath,
  workflowWatchPaths,
  pluginWatchPaths,
  arvisReduxStoreResetFlagPath,
  arvisRenewExtensionFlagFilePath,
};
