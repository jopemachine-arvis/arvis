import { IOHookKeyEvent } from '@hooks/useIoHook';

export const isMetaKey = (e: IOHookKeyEvent) => {
  if (process.platform === 'darwin') {
    // On Mac, right cmd key is double triggered. One of them's keycode is not 3676.
    return e.keycode === 3675 || e.keycode === 3676;
  }
  return e.metaKey;
};

export const isAltKey = (e: IOHookKeyEvent) => {
  return e.altKey && (e.keycode === 56 || e.keycode === 3640);
};

export const isShiftKey = (e: IOHookKeyEvent) => {
  return e.shiftKey && (e.keycode === 42 || e.keycode === 54);
};

export const isCtrlKey = (e: IOHookKeyEvent) => {
  return e.ctrlKey && (e.keycode === 29 || e.keycode === 3613);
};
