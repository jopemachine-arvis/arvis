/* eslint-disable @typescript-eslint/dot-notation */
import { ClipboardManagerActions } from '../actions';
import { StateType } from './types';

const { actionTypes: ClipboardManagerActionTypes } = ClipboardManagerActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case ClipboardManagerActionTypes.CLEAR_CLIPBOARD_STORE:
      return {
        ...state,
        store: [],
      };
    case ClipboardManagerActionTypes.PUSH_CLIPBOARD_STORE:
      state['store'].push(JSON.parse(payload.arg));
      return {
        ...state,
      };
    case ClipboardManagerActionTypes.SET_CLIPBOARD_MANAGER_WINDOW_HOTKEY:
      return {
        ...state,
        hotkey: payload.arg,
      };
    case ClipboardManagerActionTypes.SET_MAX_CLIPBOARD_STORE_SIZE:
      return {
        ...state,
        max_size: payload.arg,
      };
    default:
      return state;
  }
};

export function getClipboardManagerHotkey(state: StateType) {
  return state.clipboard_manager.hotkey;
}

export function getMaxSize(state: StateType) {
  return state.clipboard_manager.max_size;
}

export function getClipboardStore(state: StateType) {
  return state.clipboard_manager.store;
}
