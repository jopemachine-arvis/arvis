const untildify = require('untildify');
const fse = require('fs-extra');
const homeDir = require('os').homedir();
const fileBasedUtilities = require('./fileBasedUtilities');

module.exports = {
  /* Public */

  // options - {Object}
  //   :appName - {String}
  //   :appPath - {String}
  //   :isHiddenOnLaunch - {Boolean}
  // Returns a Promise
  enable({ appName, appPath, isHiddenOnLaunch }) {
    return fse.readdir(`${homeDir}/Applications`).then((files) => {
      files.map((fileName) => {
        if (fileName.startsWith(appName)) {
          const hiddenArg = isHiddenOnLaunch ? ' --hidden' : '';
          const data = `[Desktop Entry]
Type=Application
Version=1.0
Name=${appName}
Comment=${appName}startup script
Exec=${homeDir}/Applications/${fileName}
X-GNOME-Autostart-enabled=true
StartupNotify=false
NoDisplay=false
Terminal=false`;

          return fileBasedUtilities.createFile({
            data,
            directory: this.getDirectory(),
            filePath: this.getFilePath(appName),
          });
        }
      });
    });
  },

  // appName - {String}
  // Returns a Promise
  disable(appName) {
    return fileBasedUtilities.removeFile(this.getFilePath(appName));
  },

  // appName - {String}
  // Returns a Promise which resolves to a {Boolean}
  isEnabled(appName) {
    return fileBasedUtilities.isEnabled(this.getFilePath(appName));
  },

  /* Private */

  // Returns a {String}
  getDirectory() {
    return untildify('~/.config/autostart/');
  },

  // appName - {String}
  // Returns a {String}
  getFilePath(appName) {
    return `${this.getDirectory()}${appName}.desktop`;
  },
};
