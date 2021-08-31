import React from 'react';
import readdirp from 'readdirp';
import { arvisSnippetCollectionPath } from '@config/path';
import path from 'path';
import fse from 'fs-extra';
import plist from 'plist';

export const fetchSnippetCollection = async () => {
  return new Promise<{
    collections: string[];
    collectionInfos: string[];
  }>((resolve, reject) => {
    const targetCollectionFiles: string[] = [];
    const targetCollectionInfoFiles: string[] = [];

    readdirp(arvisSnippetCollectionPath, {
      fileFilter: [`*.json`, 'info.plist'],
      depth: 1,
      type: 'files',
    })
      .on('data', (entry) => {
        const filePath = path.resolve(arvisSnippetCollectionPath, entry.path);

        if (entry.path.endsWith('info.plist')) {
          targetCollectionInfoFiles.push(filePath);
        } else {
          targetCollectionFiles.push(filePath);
        }
      })
      .on('error', reject)
      .on('end', () => {
        resolve({
          collections: targetCollectionFiles,
          collectionInfos: targetCollectionInfoFiles,
        });
      });
  });
};

export const loadSnippetCollectionInfo = async (
  collectionInfoFiles: string[]
) => {
  const result = await Promise.allSettled(
    collectionInfoFiles.map((filePath) => {
      return new Promise((resolve, reject) => {
        fse
          .readFile(filePath, { encoding: 'utf8' })
          .then((info) => {
            const collectionInfo: any = plist.parse(info);
            const snippetKeywordPrefix = collectionInfo.snippetkeywordprefix;
            const snippetKeywordSuffix = collectionInfo.snippetkeywordsuffix;

            resolve({
              collection: path
                .basename(path.dirname(filePath))
                .split('info.plist')[0],
              info: { snippetKeywordPrefix, snippetKeywordSuffix },
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

export const loadSnippetCollection = async (collectionFiles: string[]) => {
  const result = await Promise.allSettled(
    collectionFiles.map((filePath) => {
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

    const snippet = snippetJson.alfredsnippet ?? snippetJson.arvissnippet;

    if (snippet) {
      snippetsToSet.push({
        collection,
        name: snippet.name,
        keyword: snippet.keyword,
        useAutoExpand:
          !snippet.dontautoexpand ?? snippet.useAutoExpand ?? false,
        snippet: snippet.snippet,
        uid: snippet.uid,
      });
    }
  });

  return snippetsToSet;
};
