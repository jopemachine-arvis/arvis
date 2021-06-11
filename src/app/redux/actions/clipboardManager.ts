import makeActionCreator from '../../utils/makeActionCreator';

export const actionTypes = {
  PUSH_CLIPBOARD_STORE: '@clipboardStore/PUSH_CLIPBOARD_STORE',
  CLEAR_CLIPBOARD_STORE: '@clipboardStore/CLEAR_CLIPBOARD_STORE',
  SET_MAX_CLIPBOARD_STORE_SIZE: '@clipboardStore/SET_MAX_CLIPBOARD_STORE_SIZE',
  SET_CLIPBOARD_MANAGER_WINDOW_HOTKEY:
    '@clipboardStore/SET_CLIPBOARD_MANAGER_WINDOW_HOTKEY',
};

export const pushClipboardStore = makeActionCreator(
  actionTypes.PUSH_CLIPBOARD_STORE,
  'arg'
);

export const clearClipboardStore = makeActionCreator(
  actionTypes.CLEAR_CLIPBOARD_STORE
);

export const setMaxClipboardStoreSize = makeActionCreator(
  actionTypes.CLEAR_CLIPBOARD_STORE,
  'arg'
);

export const setClipboardManagerWindowHotkey = makeActionCreator(
  actionTypes.CLEAR_CLIPBOARD_STORE,
  'arg'
);
