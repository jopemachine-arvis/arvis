import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export default class AppUpdater {
  constructor() {
    autoUpdater.logger = log;
    console.log('Current version', autoUpdater.currentVersion);
    autoUpdater.checkForUpdatesAndNotify();
  }
}
