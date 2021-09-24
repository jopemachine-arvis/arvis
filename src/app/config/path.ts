import path from 'path';
import { Core } from 'arvis-core';
import { is } from 'electron-util';

const workflowWatchPaths = [
  `${Core.path.workflowInstallPath}${path.sep}*${path.sep}arvis-workflow.json`,
];

// Detects only changes to plugin root folder files to save system resources
const pluginWatchPaths = [
  `${Core.path.pluginInstallPath}${path.sep}*${path.sep}*.js`,
  `${Core.path.pluginInstallPath}${path.sep}*${path.sep}arvis-plugin.json`,
];

const arvisSnippetCollectionPath = path.resolve(
  Core.path.installedDataPath,
  'snippets'
);

const arvisClipboardHistoryStore = path.resolve(
  Core.path.installedDataPath,
  'clipboard-history.json'
);

const arvisReduxStoreResetFlagPath = path.resolve(
  Core.path.installedDataPath,
  'arvis-redux-store-reset'
);

const arvisRenewExtensionFlagFilePath = path.resolve(
  Core.path.installedDataPath,
  'arvis-extension-renew'
);

const getProjectRootPath = () => {
  if (is.renderer) {
    return __dirname.split(path.sep).slice(0, -1).join(path.sep);
  }

  return require('electron')
    .app.getAppPath()
    .split(path.sep)
    .slice(0, -1)
    .join(path.sep);
};

const getArvisAssetsPath = () => path.resolve(getProjectRootPath(), 'assets');

const getArvisScriptsPath = () => path.resolve(getArvisAssetsPath(), 'scripts');

const getExecaPath = () =>
  path.resolve(getArvisScriptsPath(), 'execa', 'index.js');

export {
  getArvisAssetsPath,
  getArvisScriptsPath,
  getProjectRootPath,
  getExecaPath,
  arvisClipboardHistoryStore,
  arvisReduxStoreResetFlagPath,
  arvisRenewExtensionFlagFilePath,
  arvisSnippetCollectionPath,
  pluginWatchPaths,
  workflowWatchPaths,
};
