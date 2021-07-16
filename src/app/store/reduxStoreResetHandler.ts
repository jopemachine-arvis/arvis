/* eslint-disable no-continue */
/* eslint-disable promise/no-nesting */
/* eslint-disable no-restricted-syntax */
import pathExists from 'path-exists';
import fse from 'fs-extra';
import parseJson from 'parse-json';
import { arvisReduxStoreResetFlagPath } from '../config/path';
import initialState from '../config/initialState';
import { electronStore } from './electronStorage';

// Assume:: store tree has outer objects and have inner objects in it.
export const reduxStoreResetHandler = () => {
  const updatedInitialState: any = { ...initialState };

  pathExists(arvisReduxStoreResetFlagPath)
    .then((shouldBeReset) => {
      if (shouldBeReset) {
        fse
          .readJSON(arvisReduxStoreResetFlagPath)
          .then((prevStore) => {
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

            for (const key of Object.keys(updatedInitialState)) {
              updatedInitialState[key] = JSON.stringify(
                updatedInitialState[key]
              );
            }

            electronStore.set(
              'persist:root',
              JSON.stringify({
                ...parseJson(electronStore.get('persist:root', '{}') as string),
                ...updatedInitialState,
              })
            );

            fse.remove(arvisReduxStoreResetFlagPath).catch(console.error);
            return null;
          })
          .catch(console.error);
      }
      return null;
    })
    .catch(console.error);
};
