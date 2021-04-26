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
    case GlobalConfigActionTypes.SET_MAX_ITEM_COUNT_TO_SHOW:
      return {
        ...state,
        max_item_count_to_show: payload.number
      };
    case GlobalConfigActionTypes.SET_MAX_ITEM_COUNT_TO_SEARCH:
      return {
        ...state,
        max_item_count_to_search: payload.number
      };
    default:
      return state;
  }
};

export function getHotkey(state: any) {
  return state.globalConfig.hotkey;
}

export function getItemMaxCountToShow(state: any) {
  return state.globalConfig.max_item_count_to_show;
}

export function getItemMaxCountToSearch(state: any) {
  return state.globalConfig.max_item_count_to_search;
}

export function isAutoLaunchAtLogin(state: any) {
  return state.globalConfig.launch_at_login;
}
