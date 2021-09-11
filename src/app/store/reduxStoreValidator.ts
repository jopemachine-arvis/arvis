import { StateType } from '@redux/reducers/types';
import initialState from '@config/initialState';

export const validate = (store: any): store is StateType => {
  // Assume:: store tree has outer objects and have inner objects in it.
  const outerKeys = Object.keys(initialState);
  for (const outerKey of outerKeys) {
    if (!(store as any)[outerKey]) {
      console.log(
        `${outerKey} does not exist in store. Need to reset config..`
      );
      return false;
    }
    const innerObj = (initialState as any)[outerKey];
    const innerKeys = Object.keys(innerObj);
    for (const innerKey of innerKeys) {
      if ((store as any)[outerKey][innerKey] === undefined) {
        console.log(
          `${innerKey} does not exist in store. Need to reset config..`
        );
        return false;
      }
    }
  }
  return true;
};
