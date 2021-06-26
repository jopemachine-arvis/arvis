const fs = require('fs');
const mkdirp = require('mkdirp');

// Public: a few utils for file-based auto-launching
module.exports = {
  /* Public */

  // This is essentially enabling auto-launching
  // options - {Object}
  //   :data - {String}
  //   :directory - {String}
  //   :filePath - {String}
  // Returns a Promise
  createFile({ directory, filePath, data }) {
    return new Promise((resolve, reject) =>
      mkdirp(directory).then(
        () => {
          return fs.writeFile(filePath, data, function (writeErr) {
            if (writeErr != null) {
              return reject(writeErr);
            }
            return resolve();
          });
        },
        (mkdirErr) => reject(mkdirErr)
      )
    );
  },

  // filePath - {String}
  isEnabled(filePath) {
    return new Promise((resolve, reject) => {
      return fs.stat(filePath, function (err, stat) {
        if (err != null) {
          return resolve(false);
        }
        return resolve(stat != null);
      });
    });
  },

  // This is essentially disabling auto-launching
  // filePath - {String}
  // Returns a Promise
  removeFile(filePath) {
    return new Promise((resolve, reject) => {
      return fs.stat(filePath, function (statErr) {
        // If it doesn't exist, this is good so resolve
        if (statErr != null) {
          return resolve();
        }

        return fs.unlink(filePath, function (unlinkErr) {
          if (unlinkErr != null) {
            return reject(unlinkErr);
          }
          return resolve();
        });
      });
    });
  },
};
