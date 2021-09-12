import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { dialog } from 'electron';
import semver from 'semver';
import pkg from './pkg';

export const checkUpdateManually = () => {
  return autoUpdater
    .checkForUpdates()
    .then((hasUpdate) => {
      if (hasUpdate && semver.lte(hasUpdate.updateInfo.version, pkg.version)) {
        dialog.showMessageBox({
          title: 'No update available',
          message: 'No update available',
        });
      }

      return hasUpdate;
    })
    .catch((err) => {
      dialog.showErrorBox('Error occured while checking update', err);
    });
};

export const checkUpdate = () => {
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

  autoUpdater.checkForUpdates();

  autoUpdater.on('update-downloaded', (info) => {
    const btnIndex = dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['Ok', 'Cancel'],
      defaultId: 0,
      title: 'Confirm Update',
      message:
        'Update available. Would you like to download and install new version?',
      detail:
        'Application will automatically restart to apply update after download',
    });

    if (btnIndex === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  // Check every 10 hour for new updates
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60 * 60 * 1000 * 10);
};
