import filenamify from 'filenamify';
import unusedFilename from 'unused-filename';
import path from 'path';
import plist from 'plist';
import fse from 'fs-extra';
import { v4 as generateUuid } from 'uuid';
import { arvisSnippetCollectionPath } from '../../../config/path';

export const generateSnippetUid = () => {
  return generateUuid();
};

export const createEmptySnippet = async (collectionDirName: string) => {
  const uid = generateSnippetUid();

  const fileName = await unusedFilename(
    path.resolve(collectionDirName, `empty [${uid}].json`)
  );

  return fse.writeJSON(
    fileName,
    {
      arvissnippet: {
        snippet: 'empty',
        dontautoexpand: true,
        name: '',
        keyword: '',
        uid,
      },
    },
    { encoding: 'utf8', spaces: 4 }
  );
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

export const deleteSnippet = (snippet: SnippetItem) => {
  const snippetPath = filenamifyPath(
    path.resolve(
      arvisSnippetCollectionPath,
      snippet.collection,
      `${snippet.name} [${snippet.uid}].json`
    )
  );

  return fse.remove(snippetPath);
};
