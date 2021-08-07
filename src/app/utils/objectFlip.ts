// eslint-disable-next-line @typescript-eslint/ban-types
export const objectFlip = (obj: any) => {
  const ret: any = {};
  Object.keys(obj).forEach((key) => {
    ret[obj[key]] = key;
  });
  return ret;
};
