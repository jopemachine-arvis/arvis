/* eslint-disable @typescript-eslint/dot-notation */
import { ClipboardHistoryActions } from '../actions';
import { StateType } from './types';

const { actionTypes: ClipboardHistoryActionTypes } = ClipboardHistoryActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case ClipboardHistoryActionTypes.CLEAR_CLIPBOARD_STORE:
      return {
        ...state,
        store: [],
      };
    case ClipboardHistoryActionTypes.PUSH_CLIPBOARD_STORE:
      state['store'].push(JSON.parse(payload.arg));
      return {
        ...state,
      };
    case ClipboardHistoryActionTypes.SET_CLIPBOARD_MANAGER_WINDOW_HOTKEY:
      return {
        ...state,
        hotkey: payload.arg,
      };
    case ClipboardHistoryActionTypes.SET_MAX_CLIPBOARD_STORE_SIZE:
      return {
        ...state,
        max_size: payload.arg,
      };
    default:
      return state;
  }
};

export function getClipboardHistoryHotkey(state: StateType) {
  return state.clipboard_history.hotkey;
}

export function getMaxSize(state: StateType) {
  return state.clipboard_history.max_size;
}

export function getClipboardStore(state: StateType) {
  return state.clipboard_history.store;
}
