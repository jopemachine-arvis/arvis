import makeActionCreator from '../../utils/makeActionCreator';

export const actionTypes = {
  SET_LAUNCH_AT_LOGIN: '@globalConfig/SET_SAVE_REGULAR',
  SET_HOT_KEY: '@globalConfig/SET_HOT_KEY'
};

export const setLaunchAtLogin = makeActionCreator(
  actionTypes.SET_LAUNCH_AT_LOGIN,
  'bool'
);

export const setHotkey = makeActionCreator(actionTypes.SET_HOT_KEY, 'hotkey');
