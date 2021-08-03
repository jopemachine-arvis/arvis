/**
 * Supported image formats of html.
 * Add more if there are any missing items
 */
export const supportedImageFormats = [
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
];

/**
 * @param extname
 */
export const isSupportedImageFormat = (extname: string) => {
  if (extname.startsWith('.')) {
    return supportedImageFormats.includes(extname.split('.')[1]);
  }

  return supportedImageFormats.includes(extname);
};
