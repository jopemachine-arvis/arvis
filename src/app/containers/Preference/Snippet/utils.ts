import filenamify from 'filenamify';
import path from 'path';
import plist from 'plist';
import fse from 'fs-extra';
import { v4 as generateUuid } from 'uuid';
import _ from 'lodash';
import pathExists from 'path-exists';
import { arvisSnippetCollectionPath } from '../../../config/path';

export const generateSnippetUid = () => {
  return generateUuid();
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

  return removeMultipleSpace(filenamify(str, { replacement: ' ' }));
};

export const snippetInfosChangeHandler = (
  snippet: SnippetItem,
  targets: string[],
  values: (string | boolean)[]
) => {
  if (targets.length !== values.length)
    throw new Error('targets length should be equal to values length');

  // Update snippet by updating json file
  const snippetFileName = filenamifyPath(
    `${snippet.name} [${snippet.uid}].json`
  );

  const snippetPath = path.resolve(
    arvisSnippetCollectionPath,
    snippet.collection,
    snippetFileName
  );

  const data: Record<string, any> = {
    snippet: snippet.snippet,
    dontautoexpand: !snippet.useAutoExpand,
    name: snippet.name,
    keyword: snippet.keyword,
    uid: snippet.uid,
  };

  for (const newData of _.unzip([targets, values] as (string | boolean)[][])) {
    const [target, value] = newData;

    if (target === 'useAutoExpand') {
      data.dontautoexpand = value;
    } else {
      data[target as string] = value;
    }
  }

  return fse.writeJson(
    snippetPath,
    { arvissnippet: data },
    { encoding: 'utf8', spaces: 4 }
  );
};

export const snippetInfoChangeHandler = (
  snippet: SnippetItem,
  target: string,
  value: string | boolean
) => {
  return snippetInfosChangeHandler(snippet, [target], [value]);
};

export const createEmptySnippet = async (collectionDirName: string) => {
  const uid = generateSnippetUid();

  const filePath = filenamifyPath(
    path.resolve(
      arvisSnippetCollectionPath,
      collectionDirName,
      `empty [${uid}].json`
    )
  );

  return fse.writeJSON(
    filePath,
    {
      arvissnippet: {
        name: 'empty',
        dontautoexpand: true,
        snippet: '',
        keyword: '',
        uid,
      },
    },
    { encoding: 'utf8', spaces: 4 }
  );
};

export const snippetNameChangeHandler = async (
  snippet: SnippetItem,
  newName: string
) => {
  // Update snippet by changing file name
  const oldFileName = filenamifyPath(`${snippet.name} [${snippet.uid}].json`);
  const newFileName = filenamifyPath(`${newName} [${snippet.uid}].json`);

  const oldPath = path.resolve(
    arvisSnippetCollectionPath,
    snippet.collection,
    oldFileName
  );

  const newPath = path.resolve(
    arvisSnippetCollectionPath,
    snippet.collection,
    newFileName
  );

  return fse.rename(oldPath, newPath).then(async () => {
    if (await pathExists(oldPath)) {
      await fse.remove(oldPath);
    }
    return null;
  });
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
