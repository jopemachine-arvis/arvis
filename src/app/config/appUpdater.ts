import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export default class AppUpdater {
  constructor() {
    autoUpdater.logger = log;
    autoUpdater.allowPrerelease = true;
    autoUpdater.allowDowngrade = false;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.setFeedURL({
      private: false,
      provider: 'github',
      owner: 'jopemachine',
      repo: 'arvis',
    });
    autoUpdater.checkForUpdatesAndNotify();
  }
}
