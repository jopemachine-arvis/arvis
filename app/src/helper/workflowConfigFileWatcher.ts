import chokidar from 'chokidar';
import { Core } from 'arvis-core';
import path from 'path';

export const startFileWatcher = () => {
  // Initialize watcher.
  // It detects workflow config file change and
  // loads new workflow config file if it detects a change.
  chokidar
    .watch(`${Core.path.workflowInstallPath}${path.sep}**${path.sep}*.json`, {
      persistent: true,
      ignoreInitial: true,
      followSymlinks: false
    })
    .on('change', filePath => {
      console.log(filePath);
    });
};
