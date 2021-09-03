import filenamify from 'filenamify';
import path from 'path';
import plist from 'plist';
import fse from 'fs-extra';

export const createEmptySnippet = (
  collectionDirName: string,
  callback: () => void
) => {
  return fse
    .writeJSON(
      path.resolve(collectionDirName, 'empty.json'),
      {
        arvissnippet: {
          snippet: 'empty',
          dontautoexpand: true,
          name: '',
          keyword: '',
        },
      },
      { encoding: 'utf8', spaces: 4 }
    )
    .then(callback)
    .catch(console.error);
};

export const removeMultipleSpace = (str: string) => {
  return str.replace(/\s\s+/g, ' ');
};

export const rebuildPlist = (plistPath: string, info: any) => {
  const plistStr = plist.build(info, {
    allowEmpty: true,
    pretty: true,
    dontPrettyTextNodes: false,
    indent: '\t',
  });

  return fse.writeFile(plistPath, plistStr, { encoding: 'utf8' });
};

export const filenamifyPath = (str: string, options?: any) => {
  if (path.isAbsolute(str)) {
    const filename = filenamify(
      path.basename(str),
      options ?? { replacement: ' ' }
    );
    return path.resolve(path.dirname(str), removeMultipleSpace(filename));
  }

  return removeMultipleSpace(filenamify(str));
};
