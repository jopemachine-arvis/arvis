import makeActionCreator from '@utils/makeActionCreator';

export const actionTypes = {
  SET_LAUNCH_AT_LOGIN: '@GLOBAL_CONFIG/SET_SAVE_REGULAR',
  SET_MAX_ITEM_COUNT_TO_SEARCH: '@GLOBAL_CONFIG/SET_MAX_ITEM_COUNT_TO_SEARCH',
  SET_MAX_ITEM_COUNT_TO_SHOW: '@GLOBAL_CONFIG/SET_MAX_ITEM_COUNT_TO_SHOW',
  SET_GLOBAL_FONT: '@GLOBAL_CONFIG/SET_GLOBAL_FONT',
  SET_TOGGLE_SEARCH_WINDOW_HOTKEY:
    '@GLOBAL_CONFIG/SET_TOGGLE_SEARCH_WINDOW_HOTKEY',
};

export const setLaunchAtLogin = makeActionCreator(
  actionTypes.SET_LAUNCH_AT_LOGIN,
  'arg'
);

export const setHotkey = makeActionCreator(
  actionTypes.SET_TOGGLE_SEARCH_WINDOW_HOTKEY,
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
