import { makeActionCreator } from '@utils/makeActionCreator';

export const actionTypes = {
  SET_MAX_CLIPBOARD_STORE_SIZE: '@CLIPBOARD_STORE/SET_MAX_CLIPBOARD_STORE_SIZE',
  SET_APPLY_MOUSE_HOVER_EVENT_FLAG:
    '@CLIPBOARD_STORE/SET_APPLY_MOUSE_HOVER_EVENT_FLAG',
};

export const setApplyMouseHoverEvent = makeActionCreator(
  actionTypes.SET_APPLY_MOUSE_HOVER_EVENT_FLAG,
  'arg'
);

export const setMaxClipboardStoreSize = makeActionCreator(
  actionTypes.SET_MAX_CLIPBOARD_STORE_SIZE,
  'arg'
);
