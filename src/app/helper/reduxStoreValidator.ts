/* eslint-disable no-restricted-syntax */
import { StateType } from '../redux/reducers/types';

export const validate = (store: any): store is StateType => {
  // Assume:: store tree has outer objects and have inner objects in it.
  const outerKeys = Object.keys(store);
  for (const outerKey of outerKeys) {
    const innerObj = store[outerKey];
    const innerKeys = Object.keys(innerObj);
    for (const innerKey of innerKeys) {
      if (innerObj[innerKey] === undefined) {
        console.log(
          `${innerKey} does not exist in store. Need to reset config..`
        );
        return false;
      }
    }
  }
  return true;
};
