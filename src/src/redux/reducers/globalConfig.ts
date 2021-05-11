import { GlobalConfigActions } from '../actions';

const { actionTypes: GlobalConfigActionTypes } = GlobalConfigActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case GlobalConfigActionTypes.SET_HOT_KEY:
      return {
        ...state,
        hotkey: payload.arg,
      };
    case GlobalConfigActionTypes.SET_LAUNCH_AT_LOGIN:
      return {
        ...state,
        launch_at_login: payload.arg,
      };
    case GlobalConfigActionTypes.SET_MAX_ITEM_COUNT_TO_SHOW:
      return {
        ...state,
        max_item_count_to_show: payload.arg,
      };
    case GlobalConfigActionTypes.SET_MAX_ITEM_COUNT_TO_SEARCH:
      return {
        ...state,
        max_item_count_to_search: payload.arg,
      };
    case GlobalConfigActionTypes.SET_GLOBAL_FONT:
      return {
        ...state,
        global_font: payload.arg,
      };
    default:
      return state;
  }
};

export function getHotkey(state: any) {
  return state.global_config.hotkey;
}

export function getItemMaxCountToShow(state: any) {
  return state.global_config.max_item_count_to_show;
}

export function getItemMaxCountToSearch(state: any) {
  return state.global_config.max_item_count_to_search;
}

export function isAutoLaunchAtLogin(state: any) {
  return state.global_config.launch_at_login;
}

export function getGlobalFont(state: any) {
  return state.global_config.global_font;
}
