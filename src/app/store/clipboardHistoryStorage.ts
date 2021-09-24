/* eslint-disable import/no-mutable-exports */
import fse from 'fs-extra';
import { arvisClipboardHistoryStore } from '../config/path';

export let store: any[] | undefined;

let max = -1;

export const push = async ({ date, text }: { date: number; text: string }) => {
  if (!store) throw new Error('clipboardHistoryStore is not initialized!');

  if (max <= store.length) {
    store = store.slice(store.length - max + 1);
  }

  store.push({
    date,
    text,
  });

  return fse.writeJSON(
    arvisClipboardHistoryStore,
    { items: store },
    { encoding: 'utf8' }
  );
};

export const clear = () => {
  if (!store) throw new Error('clipboardHistoryStore is not initialized!');
  store = [];
};

const validateJson = (json: any) => {
  return json!.items || json!.items.length;
};

export const importClipboardHistoryStorage = () => {
  try {
    const json = fse.readJSONSync(arvisClipboardHistoryStore, {
      encoding: 'utf8',
    });
    if (!validateJson(json)) throw new Error();

    store = json.items;
  } catch (err) {
    store = [];
  }
};

export const writeClipboardHistoryStorage = () => {
  fse.writeJSONSync(
    arvisClipboardHistoryStore,
    { items: store },
    { encoding: 'utf8' }
  );
};

export const setStoreMaxSize = (size: number) => {
  max = size;
};
