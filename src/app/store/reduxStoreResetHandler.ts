/* eslint-disable no-continue */
/* eslint-disable promise/no-nesting */
/* eslint-disable no-restricted-syntax */
import { Core } from 'arvis-core';
import path from 'path';
import pathExists from 'path-exists';
import fse from 'fs-extra';
import initialState from '../config/initialState';
import { electronStore } from './electronStorage';

export const reduxStoreResetHandler = () => {
  const resetFile = path.resolve(Core.path.tempPath, 'arvis-redux-store-reset');
  const updatedInitialState = initialState;

  pathExists(resetFile)
    .then((shouldBeReset) => {
      if (shouldBeReset) {
        fse
          .readJSON(resetFile)
          .then((prevStore) => {
            // Assume:: store tree has outer objects and have inner objects in it.

            const outerKeys = Object.keys(prevStore);
            for (const outerKey of outerKeys) {
              if (!(updatedInitialState as any)[outerKey]) continue;

              const innerObj = prevStore[outerKey];
              const innerKeys = Object.keys(innerObj);
              for (const innerKey of innerKeys) {
                if ((updatedInitialState as any)[outerKey][innerKey]) {
                  (updatedInitialState as any)[outerKey][innerKey] =
                    prevStore[outerKey][innerKey];
                }
              }
            }

            fse.writeJsonSync(
              path.resolve(electronStore.path),
              updatedInitialState,
              {
                encoding: 'utf8',
                spaces: 4,
              }
            );

            fse.removeSync(resetFile);
            return null;
          })
          .catch(console.error);
      }
      return null;
    })
    .catch(console.error);
};
