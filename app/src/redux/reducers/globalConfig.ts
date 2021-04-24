import { GlobalConfigActions } from '../actions';

const { actionTypes: GlobalConfigActionTypes } = GlobalConfigActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case GlobalConfigActionTypes.SET_HOT_KEY:
      return {
        ...state,
        hotkey: payload.hotkey
      };
    case GlobalConfigActionTypes.SET_LAUNCH_AT_LOGIN:
      return {
        ...state,
        launch_at_login: payload.bool
      };
    case GlobalConfigActionTypes.SET_MAX_ITEM_COUNT:
      return {
        ...state,
        max_item_count: payload.number
      };
    default:
      return state;
  }
};

export function getHotkey(state: any) {
  return state.globalConfig.hotkey;
}

export function isAutoLaunchAtLogin(state: any) {
  return state.globalConfig.launch_at_login;
}

export function getItemMaxCount(state: any) {
  return state.globalConfig.max_item_count;
}
