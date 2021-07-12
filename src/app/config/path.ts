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
  Core.path.tempPath,
  'arvis-redux-store-reset'
);
const arvisRenewExtensionFlagFilePath = path.resolve(
  Core.path.installedDataPath,
  'arvis-extension-renew'
);

export {
  workflowWatchPaths,
  pluginWatchPaths,
  arvisReduxStoreResetFlagPath,
  arvisRenewExtensionFlagFilePath,
};
