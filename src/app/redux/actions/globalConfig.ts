import { makeActionCreator } from '@utils/makeActionCreator';

export const actionTypes = {
  SET_LAUNCH_AT_LOGIN: '@GLOBAL_CONFIG/SET_SAVE_REGULAR',
  SET_MAX_ITEM_COUNT_TO_SEARCH: '@GLOBAL_CONFIG/SET_MAX_ITEM_COUNT_TO_SEARCH',
  SET_MAX_ITEM_COUNT_TO_SHOW: '@GLOBAL_CONFIG/SET_MAX_ITEM_COUNT_TO_SHOW',
  SET_GLOBAL_FONT: '@GLOBAL_CONFIG/SET_GLOBAL_FONT',
  SET_SEARCH_WINDOW_HOTKEY: '@GLOBAL_CONFIG/SET_SEARCH_WINDOW_HOTKEY',
  SET_CLIPBOARD_HISTORY_WINDOW_HOTKEY:
    '@GLOBAL_CONFIG/SET_CLIPBOARD_HISTORY_WINDOW_HOTKEY',
  SET_UNIVERSAL_ACTION_WINDOW_HOTKEY:
    '@GLOBAL_CONFIG/SET_UNIVERSAL_ACTION_WINDOW_HOTKEY',
  SET_SNIPPET_WINDOW_HOTKEY: '@GLOBAL_CONFIG/SET_SNIPPET_WINDOW_HOTKEY',
};

export const setLaunchAtLogin = makeActionCreator(
  actionTypes.SET_LAUNCH_AT_LOGIN,
  'arg'
);

export const setSearchWindowHotkey = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_HOTKEY,
  'arg'
);

export const setSnippetHotkey = makeActionCreator(
  actionTypes.SET_SNIPPET_WINDOW_HOTKEY,
  'arg'
);

export const setClipboardHistoryWindowHotkey = makeActionCreator(
  actionTypes.SET_CLIPBOARD_HISTORY_WINDOW_HOTKEY,
  'arg'
);

export const setUniversalActionWindowHotkey = makeActionCreator(
  actionTypes.SET_UNIVERSAL_ACTION_WINDOW_HOTKEY,
  'arg'
);

export const setMaxItemCountToSearch = makeActionCreator(
  actionTypes.SET_MAX_ITEM_COUNT_TO_SEARCH,
  'arg'
);

export const setMaxItemCountToShow = makeActionCreator(
  actionTypes.SET_MAX_ITEM_COUNT_TO_SHOW,
  'arg'
);

export const setGlobalFont = makeActionCreator(
  actionTypes.SET_GLOBAL_FONT,
  'arg'
);
