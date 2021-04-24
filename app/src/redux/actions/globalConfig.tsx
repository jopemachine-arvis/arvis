import makeActionCreator from '../../utils/makeActionCreator';

export const actionTypes = {
  SET_LAUNCH_AT_LOGIN: '@globalConfig/SET_SAVE_REGULAR',
  SET_HOT_KEY: '@globalConfig/SET_HOT_KEY',
  SET_MAX_ITEM_COUNT: '@globalConfig/SET_MAX_ITEM_COUNT'
};

export const setLaunchAtLogin = makeActionCreator(
  actionTypes.SET_LAUNCH_AT_LOGIN,
  'bool'
);

export const setHotkey = makeActionCreator(actionTypes.SET_HOT_KEY, 'hotkey');

export const setMaxItemCount = makeActionCreator(
  actionTypes.SET_MAX_ITEM_COUNT,
  'number'
);
