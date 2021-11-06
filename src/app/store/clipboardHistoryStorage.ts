/* eslint-disable import/no-mutable-exports */
import fse from 'fs-extra';
import _ from 'lodash';
import { arvisClipboardHistoryStore } from '../config/path';

export let store: any[] | undefined;

let max = -1;

export const push = async ({ date, text }: { date: number; text: string }) => {
  if (!store) throw new Error('clipboardHistoryStore is not initialized!');

  // Avoid copying duplicated texts
  if (!_.isEmpty(store) && store[store.length - 1].text === text) return;

  if (max <= store.length) {
    store = store.slice(store.length - max + 1);
  }

  store.push({
    date,
    text,
  });

  fse.writeJSON(
    arvisClipboardHistoryStore,
    { items: store },
    { encoding: 'utf8' }
  );
};

export const clear = () => {
  if (!store) throw new Error('clipboardHistoryStore is not initialized!');
  store = [];
};

const validateClipboardHistory = (clipboardHistoryData: any) => {
  return clipboardHistoryData!.items || clipboardHistoryData!.items.length;
};

export const importClipboardHistoryStorage = () => {
  try {
    const clipboardHistoryData = fse.readJSONSync(arvisClipboardHistoryStore, {
      encoding: 'utf8',
    });
    if (!validateClipboardHistory(clipboardHistoryData)) throw new Error();

    store = clipboardHistoryData.items;
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
