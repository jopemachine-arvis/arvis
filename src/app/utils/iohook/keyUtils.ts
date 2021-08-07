import { pascalCase } from 'pascal-case';
import { IOHookKeyEvent } from '@hooks/useIoHook';
import { keycodeTable, keycodeTableFliped, normalKeys } from './keyTbl';

export const matchKeyToIoHookKey = (key: string) => {
  switch (key) {
    case 'alt':
      return 'Left Alt';
    case 'shift':
      return 'Left Shift';
    case 'cmd':
      return 'Left Win';
    case 'ctrl':
      return 'Left Ctrl';
    default: {
      if (key.length === 1) {
        return key;
      }
      return pascalCase(key).replaceAll('_', ' ');
    }
  }
};

export const matchIoHookKeyToKey = (key: string) => {
  switch (key) {
    case 'Left Alt':
    case 'Right Alt':
      return 'alt';

    case 'Left Shift':
    case 'Right Shift':
      return 'shift';

    case 'Left Win':
    case 'Right Win':
      return 'cmd';

    case 'Left Ctrl':
    case 'Right Ctrl':
      return 'ctrl';

    default: {
      return key;
    }
  }
};

export const keyCodeToString = (keycode: number): string => {
  return (keycodeTable as any)[keycode];
};

export const stringToKeyCode = (key: string) => {
  return keycodeTableFliped[key];
};

export const isNormalKey = (keycode: number) => {
  return normalKeys.includes(keycode);
};

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
