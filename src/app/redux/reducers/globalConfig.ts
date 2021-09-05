import { GlobalConfigActions } from '@redux/actions';
import { StateType } from '@redux/reducers/types';

const { actionTypes: GlobalConfigActionTypes } = GlobalConfigActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case GlobalConfigActionTypes.SET_SEARCH_WINDOW_HOTKEY:
      return {
        ...state,
        search_window_hotkey: payload.arg,
      };
    case GlobalConfigActionTypes.SET_CLIPBOARD_HISTORY_WINDOW_HOTKEY:
      return {
        ...state,
        clipboard_history_window_hotkey: payload.arg,
      };
    case GlobalConfigActionTypes.SET_SNIPPET_WINDOW_HOTKEY:
      return {
        ...state,
        snippet_window_hotkey: payload.arg,
      };
    case GlobalConfigActionTypes.SET_UNIVERSAL_ACTION_WINDOW_HOTKEY:
      return {
        ...state,
        universal_action_window_hotkey: payload.arg,
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

export function getSearchWindowHotkey(state: StateType) {
  return state.global_config.search_window_hotkey;
}

export function getClipboardHistoryWindowHotkey(state: StateType) {
  return state.global_config.clipboard_history_window_hotkey;
}

export function getUniversalActionWindowHotkey(state: StateType) {
  return state.global_config.universal_action_window_hotkey;
}

export function getItemMaxCountToShow(state: StateType) {
  return state.global_config.max_item_count_to_show;
}

export function getItemMaxCountToSearch(state: StateType) {
  return state.global_config.max_item_count_to_search;
}

export function isAutoLaunchAtLogin(state: StateType) {
  return state.global_config.launch_at_login;
}

export function getGlobalFont(state: StateType) {
  return state.global_config.global_font;
}
