import React from 'react';
import readdirp from 'readdirp';
import { arvisSnippetCollectionPath } from '@config/path';
import path from 'path';
import fse from 'fs-extra';

export const fetchSnippetCollection = async () => {
  return new Promise<string[]>((resolve, reject) => {
    const targetFiles: string[] = [];

    readdirp(arvisSnippetCollectionPath, {
      fileFilter: `*.json`,
      depth: 1,
      type: 'files',
    })
      .on('data', (entry) => {
        targetFiles.push(path.resolve(arvisSnippetCollectionPath, entry.path));
      })
      .on('error', reject)
      .on('end', () => {
        resolve(targetFiles);
      });
  });
};

export const loadSnippetCollection = async (collectionFiles: string[]) => {
  const result = await Promise.allSettled(
    collectionFiles.map((filePath) => {
      return new Promise((resolve, reject) => {
        fse
          .readJSON(filePath, { encoding: 'utf8' })
          .then((jsonData) =>
            resolve({
              collection: path.basename(filePath).split('.json')[0],
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
        useAutoExpand: snippet.useAutoExpand,
        snippet: snippet.snippet,
      });
    }
  });

  return snippetsToSet;
};
