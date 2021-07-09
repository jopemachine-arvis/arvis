import makeActionCreator from '@utils/makeActionCreator';

export const actionTypes = {
  SET_LAUNCH_AT_LOGIN: '@globalConfig/SET_SAVE_REGULAR',
  SET_MAX_ITEM_COUNT_TO_SEARCH: '@globalConfig/SET_MAX_ITEM_COUNT_TO_SEARCH',
  SET_MAX_ITEM_COUNT_TO_SHOW: '@globalConfig/SET_MAX_ITEM_COUNT_TO_SHOW',
  SET_GLOBAL_FONT: '@globalConfig/SET_GLOBAL_FONT',
  SET_TOGGLE_SEARCH_WINDOW_HOTKEY:
    '@globalConfig/SET_TOGGLE_SEARCH_WINDOW_HOTKEY',
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
