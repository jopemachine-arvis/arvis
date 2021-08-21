import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export default class AppUpdater {
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      return;
    }

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

    // Check every 5 hour for new updates
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 60 * 60 * 1000 * 5);
  }
}
