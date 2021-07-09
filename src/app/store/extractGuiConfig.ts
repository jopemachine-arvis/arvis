import _ from 'lodash';
import initialState from '@config/initialState';

export const extractGuiConfig = (store: any) => {
  const targetKeys = Object.keys(initialState);

  const keys = _.filter(Object.keys(store), (key: string) =>
    targetKeys.includes(key)
  );

  const result: any = {};

  keys.forEach((key) => {
    result[key] = store[key];
  });

  return result;
};
