import { Core } from 'arvis-core';
import path from 'path';
import pathExists from 'path-exists';
import fse from 'fs-extra';
import initialState from '../config/initialState';
import { electronStore } from './electronStorage';

export const reduxStoreResetHandler = () => {
  const resetFile = path.resolve(Core.path.tempPath, 'arvis-redux-store-reset');
  pathExists(resetFile)
    .then((result) => {
      if (result === true) {
        fse.writeJsonSync(path.resolve(electronStore.path), initialState, {
          encoding: 'utf8',
          spaces: 2,
        });
        fse.remove(resetFile);
      }
      return null;
    })
    .catch(console.error);
};
