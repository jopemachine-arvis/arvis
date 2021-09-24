/* eslint-disable @typescript-eslint/dot-notation */
import { ClipboardHistoryActions } from '@redux/actions';
import { StateType } from '@redux/reducers/types';

const { actionTypes: ClipboardHistoryActionTypes } = ClipboardHistoryActions;

export default (state: any = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case ClipboardHistoryActionTypes.SET_MAX_CLIPBOARD_STORE_SIZE:
      return {
        ...state,
        max_size: payload.arg,
      };
    case ClipboardHistoryActionTypes.SET_APPLY_MOUSE_HOVER_EVENT_FLAG:
      return {
        ...state,
        apply_mouse_hover_event: payload.arg,
      };
    default:
      return state;
  }
};

export function getApplyMouseHoverEvent(state: StateType) {
  return state.clipboard_history.apply_mouse_hover_event;
}

export function getMaxSize(state: StateType) {
  return state.clipboard_history.max_size;
}
