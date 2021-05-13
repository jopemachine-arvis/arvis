const fse = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');
const unzipper = require('unzipper');

const { sep } = path;

const binarys = {
  darwin: ['electron-v85-darwin-x64'],
  win32: ['electron-v85-win32-ia32', 'electron-v85-win32-x64'],
  linux: []
};

const sourcePath = `.${sep}iohook-prebuilts${sep}builds`;
const targetPath = `.${sep}src${sep}node_modules${sep}iohook${sep}builds`;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Binaries on some platforms seems to be not provided or are error-prone
// So, replace these prebuilt binary files with this.
rimraf(targetPath, err => {
  if (err) {
    throw new Error(`Error on ${__filename}`, err);
  }

  for (const target of binarys[process.platform]) {
    const source = `${sourcePath}${sep}${target}`;
    rimraf(source, () => {
      const dest = `${targetPath}${sep}${target}`;

      const copyPipe = fse
        .createReadStream(source + '.zip')
        .pipe(unzipper.Extract({ path: source }));

      copyPipe.on('finish', async () => {
        await sleep(1000);

        fse.copy(source, dest, {
          recursive: true,
          overwrite: true,
          preserveTimestamps: true
        });
      });
    });
  }

  console.log(`${sourcePath} was replaced with ${targetPath}`);
});
