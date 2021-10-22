import fse from 'fs-extra';
import { parse as parseJson5 } from 'json5';

/**
 * Read JSON5 format file (JSON for Humans)
 */
export const readJson5 = async (filepath: string) => {
  return new Promise((resolve, reject) => {
    fse
      .readFile(filepath, { encoding: 'utf-8' })
      .then((content) => {
        try {
          resolve(parseJson5(content));
        } catch (err) {
          reject(err);
        }
        return null;
      })
      .catch(reject);
  });
};
