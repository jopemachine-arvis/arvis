/**
 * @param  {string} ext
 * @summary Returns whether an image format can be represented by a chrome browser
 */
export const isSupportedImageFormat = (ext: string) => {
  return [
    'apng',
    'gif',
    'ico',
    'cur',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'svg',
  ].includes(ext);
};
