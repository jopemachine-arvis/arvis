import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { dialog } from 'electron';
import semver from 'semver';
import _ from 'lodash';
import pkg from './pkg';

const askForUpdate = () => {
  const btnIndex = dialog.showMessageBoxSync({
    type: 'question',
    buttons: ['Ok', 'Cancel'],
    defaultId: 0,
    title: 'Confirm Update',
    message: 'Update available. Would you like to install new version?',
  });

  if (btnIndex === 0) {
    autoUpdater.quitAndInstall();
  }
};

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

export const autoCheckUpdateAtStartup = () => {
  autoUpdater.allowDowngrade = false;
  autoUpdater.allowPrerelease = true;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.logger = log;

  autoUpdater.setFeedURL({
    private: false,
    provider: 'github',
    owner: 'jopemachine',
    repo: 'arvis',
  });

  autoUpdater.checkForUpdates();

  autoUpdater.on('update-downloaded', askForUpdate);

  autoUpdater.on('error', (err) => {
    dialog.showMessageBoxSync({
      title: 'Error',
      message: `Error occurs\n${err}`,
    });
  });

  // Check every 10 hour for new updates
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60 * 60 * 1000 * 10);
};
