import makeActionCreator from '../../utils/makeActionCreator';

export const actionTypes = {
  SET_LAUNCH_AT_LOGIN: '@globalConfig/SET_SAVE_REGULAR',
  SET_HOT_KEY: '@globalConfig/SET_HOT_KEY',
  SET_MAX_ITEM_COUNT_TO_SEARCH: '@globalConfig/SET_MAX_ITEM_COUNT_TO_SEARCH',
  SET_MAX_ITEM_COUNT_TO_SHOW: '@globalConfig/SET_MAX_ITEM_COUNT_TO_SHOW',
  SET_GLOBAL_FONT: '@globalConfig/SET_GLOBAL_FONT'
};

export const setLaunchAtLogin = makeActionCreator(
  actionTypes.SET_LAUNCH_AT_LOGIN,
  'bool'
);

export const setHotkey = makeActionCreator(actionTypes.SET_HOT_KEY, 'hotkey');

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
