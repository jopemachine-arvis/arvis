/* eslint-disable no-restricted-syntax */
export default (dict: any) => (value: any) => {
  for (const key of Object.keys(dict)) {
    if (dict[key] !== value) return false;
  }
  return true;
};
