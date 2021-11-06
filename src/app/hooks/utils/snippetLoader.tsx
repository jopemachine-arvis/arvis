import readdirp from 'readdirp';
import { arvisSnippetCollectionPath } from '@config/path';
import path from 'path';
import fse from 'fs-extra';
import plist from 'plist';

export const fetchSnippetCollection = async () => {
  return new Promise<{
    snippetFiles: string[];
    collectionNames: string[];
    collectionInfos: string[];
  }>((resolve, reject) => {
    const targetSnippetFiles: string[] = [];
    const targetCollectionInfoFiles: string[] = [];
    const collectionNames = new Set<string>();

    readdirp(arvisSnippetCollectionPath, {
      fileFilter: [`*.json`, 'info.plist'],
      depth: 1,
      type: 'files',
    })
      .on('data', (entry) => {
        const filePath = path.resolve(arvisSnippetCollectionPath, entry.path);
        collectionNames.add(path.basename(path.dirname(filePath)));

        if (entry.path.endsWith('info.plist')) {
          targetCollectionInfoFiles.push(filePath);
        } else {
          targetSnippetFiles.push(filePath);
        }
      })
      .on('error', reject)
      .on('end', () => {
        resolve({
          snippetFiles: targetSnippetFiles,
          collectionNames: [...collectionNames.values()],
          collectionInfos: targetCollectionInfoFiles,
        });
      });
  });
};

export const loadSnippetCollectionInfo = async (
  collectionInfoFiles: string[]
): Promise<any[]> => {
  const result = await Promise.allSettled(
    collectionInfoFiles.map((filePath) => {
      return new Promise((resolve, reject) => {
        fse
          .readFile(filePath, { encoding: 'utf8' })
          .then(async (info) => {
            const collectionInfo = plist.parse(info) as AlfredSnippetPlist;
            const snippetKeywordPrefix = collectionInfo.snippetkeywordprefix;
            const snippetKeywordSuffix = collectionInfo.snippetkeywordsuffix;

            resolve({
              collection: path
                .basename(path.dirname(filePath))
                .split('info.plist')[0],
              info: {
                snippetKeywordPrefix,
                snippetKeywordSuffix,
              },
            });
            return null;
          })
          .catch(reject);
      });
    })
  );

  const collectionInfos = result
    .filter((value) => value.status === 'fulfilled')
    .map((value) => {
      return (value as PromiseFulfilledResult<any>).value;
    });

  return collectionInfos;
};

export const loadSnippetCollection = async (snippetFiles: string[]) => {
  const result = await Promise.allSettled(
    snippetFiles.map((filePath) => {
      return new Promise((resolve, reject) => {
        fse
          .readJSON(filePath, { encoding: 'utf8' })
          .then((jsonData) =>
            resolve({
              collection: path
                .basename(path.dirname(filePath))
                .split('.json')[0],
              snippetJson: jsonData,
            })
          )
          .catch(reject);
      });
    })
  );

  const snippetJsons = result
    .filter((value) => value.status === 'fulfilled')
    .map((value) => {
      return (value as PromiseFulfilledResult<any>).value;
    });

  const snippetsToSet: SnippetItem[] = [];

  snippetJsons.forEach((data) => {
    const { collection, snippetJson } = data;

    const snippet =
      snippetJson.arvissnippet ??
      snippetJson.alfredsnippet ??
      snippetJson.AlfredSnippet;

    if (snippet) {
      snippetsToSet.push({
        collection,
        name: snippet.name,
        keyword: snippet.keyword,
        useAutoExpand:
          snippet.useAutoExpand ?? !snippet.dontautoexpand ?? false,
        snippet: snippet.snippet,
        uid: snippet.uid,
      });
    }
  });

  return snippetsToSet;
};
