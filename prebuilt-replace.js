const fse = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');

const { sep } = path;
const sourcePath = `.${sep}iohook-prebuilts${sep}builds`;
const targetPath = `.${sep}app${sep}node_modules${sep}iohook${sep}builds`;

// Binaries on some platforms seems to be not provided or are error-prone
// So, replace these prebuilt binary files with this.
rimraf(targetPath, err => {
  if (err) {
    throw new Error(`Error on ${__filename}`, err);
  }

  fse.copy(sourcePath, targetPath, {
    recursive: true,
    overwrite: true,
    preserveTimestamps: true
  });

  console.log(`${sourcePath} was replaced with ${targetPath}`);
});
