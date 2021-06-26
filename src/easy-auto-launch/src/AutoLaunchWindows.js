/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const path = require('path');
const Winreg = require('winreg');

const regKey = new Winreg({
  hive: Winreg.HKCU,
  key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
});

module.exports = {
  /* Public */

  // options - {Object}
  //   :appName - {String}
  //   :appPath - {String}
  //   :isHiddenOnLaunch - {Boolean}
  // Returns a Promise
  enable({ appName, appPath, isHiddenOnLaunch }) {
    return new Promise(function (resolve, reject) {
      let pathToAutoLaunchedApp = appPath;
      let args = '';
      const updateDotExe = path.join(
        path.dirname(process.execPath),
        '..',
        'update.exe'
      );

      // If they're using Electron and Squirrel.Windows, point to its Update.exe instead
      // Otherwise, we'll auto-launch an old version after the app has updated
      if (
        (process.versions != null ? process.versions.electron : undefined) !=
          null &&
        fs.existsSync(updateDotExe)
      ) {
        pathToAutoLaunchedApp = updateDotExe;
        args = ` --processStart \"${path.basename(process.execPath)}\"`;
        if (isHiddenOnLaunch) {
          args += ' --process-start-args "--hidden"';
        }
      } else if (isHiddenOnLaunch) { args += ' --hidden'; }
      }

      return regKey.set(
        appName,
        Winreg.REG_SZ,
        `\"${pathToAutoLaunchedApp}\"${args}`,
        function (err) {
          if (err != null) {
            return reject(err);
          }
          return resolve();
        }
      );
    });
  },

  // appName - {String}
  // Returns a Promise
  disable(appName) {
    return new Promise((resolve, reject) =>
      regKey.remove(appName, function (err) {
        if (err != null) {
          // The registry key should exist but in case it fails because it doesn't exist, resolve false instead
          // rejecting with an error
          if (
            err.message.indexOf(
              'The system was unable to find the specified registry key or value'
            ) !== -1
          ) {
            return resolve(false);
          }
          return reject(err);
        }
        return resolve();
      })
    );
  },

  // appName - {String}
  // Returns a Promise which resolves to a {Boolean}
  isEnabled(appName) {
    return new Promise((resolve, reject) =>
      regKey.get(appName, function (err, item) {
        if (err != null) {
          return resolve(false);
        }
        return resolve(item != null);
      })
    );
  },
};
