/* eslint-disable promise/catch-or-return */

import unzipper from 'unzipper';
import path from 'path';
import fse from 'fs-extra';
import { arvisSnippetCollectionPath } from '@config/path';
import { sleep } from '@utils/sleep';

/**
 * @param installFile snippet installation file
 */
export const installSnippet = async (
  installFile: string
): Promise<void | Error> => {
  const collectionName = path
    .basename(installFile)
    .split(path.extname(installFile))[0];

  const extractedPath: string = path.resolve(
    arvisSnippetCollectionPath,
    collectionName
  );
  const unzipStream = fse
    .createReadStream(installFile)
    .pipe(unzipper.Extract({ path: extractedPath }));

  return new Promise((resolve, reject) => {
    unzipStream!.on('finish', () => {
      // even if the install pipe is finalized, there might be a short time when the file is not created yet.
      // it's not clear, so change below logic if it matters later.
      sleep(1000).then(() => {
        resolve();
        return null;
      });
    });

    unzipStream.on('error', reject);
  });
};

export const uninstallSnippet = async (collectionName: string) => {
  const target: string = path.resolve(
    arvisSnippetCollectionPath,
    collectionName
  );

  return fse.remove(target);
};
