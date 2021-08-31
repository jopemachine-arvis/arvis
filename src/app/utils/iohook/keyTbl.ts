import { range } from '../range';
import { objectFlip } from '../index';

/**
 * Ref: https://github.com/wilix-team/iohook/issues/74
 */
export const keycodeTable = {
  0: '§',
  1: 'Esc',
  2: '1',
  3: '2',
  4: '3',
  5: '4',
  6: '5',
  7: '6',
  8: '7',
  9: '8',
  10: '9',
  11: '0',
  12: '-',
  13: '=',
  14: 'Backspace',
  15: 'Tab',
  16: 'q',
  17: 'w',
  18: 'e',
  19: 'r',
  20: 't',
  21: 'y',
  22: 'u',
  23: 'i',
  24: 'o',
  25: 'p',
  26: '[',
  27: ']',
  28: 'Enter',
  29: 'Left Ctrl',
  30: 'a',
  31: 's',
  32: 'd',
  33: 'f',
  34: 'g',
  35: 'h',
  36: 'j',
  37: 'k',
  38: 'l',
  39: ';',
  40: "'",
  41: '`',
  42: 'Left Shift',
  43: '\\',
  44: 'z',
  45: 'x',
  46: 'c',
  47: 'v',
  48: 'b',
  49: 'n',
  50: 'm',
  51: ',',
  52: '.',
  53: '/',
  54: 'Right Shift',
  56: 'Left Alt', // macos 'Left ⌥'
  57: 'Space',
  58: 'CapsLock',
  59: 'F1',
  60: 'F2',
  61: 'F3',
  62: 'F4',
  63: 'F5',
  64: 'F6',
  65: 'F7',
  66: 'F8',
  67: 'F9',
  68: 'F10',
  87: 'F11',
  88: 'F12',
  61010: 'Insert',
  61011: 'Delete',
  60999: 'Home',
  61007: 'End',
  61001: 'Page Up',
  61009: 'Page Down',
  3639: 'Print Screen',
  3653: 'Pause Break',
  3637: 'Num /',
  55: 'Num *',
  3612: 'Num Enter',
  3655: 'Num Home',
  3657: 'Num Page Up',
  3663: 'Num End',
  3665: 'Num Page Down',
  57420: 'Num Center 5',
  3677: 'Context Menu',
  61008: 'Arrow Down',
  61005: 'Arrow Right',
  61003: 'Arrow Left',
  61000: 'Arrow Up',
  57380: 'Media Stop',
  57360: 'Media Previous',
  57378: 'Media Play',
  57369: 'Media Next',
  57390: 'Volume Down',
  57392: 'Volume Up',
  57376: 'Volume Mute',
  3613: 'Right Ctrl',
  3640: 'Right Alt', // macos 'Right ⌥'
  3675: 'Left Win', // macos 'Left ⌘'
  3676: 'Right Win', // macos 'Right ⌘'
  57419: '←',
  57416: '↑',
  57424: '↓',
  57421: '→',
};

export const specialCharTable = {
  1: '!',
  2: '@',
  3: '#',
  4: '$',
  5: '%',
  6: '^',
  7: '&',
  8: '*',
  9: '(',
  '-': '_',
  '=': '+',
  '`': '~',
  '.': '>',
  ',': '<',
  '/': '?',
  "'": '"',
  ';': ':',
  '[': '{',
  ']': '}',
  '\\': '|',
};

export const alphatbetKeys: number[] = [
  ...range(16, 25), // Alphabet
  ...range(30, 38), // Alphabet
  ...range(44, 50), // Alphabet
];

export const functionKeys: number[] = [
  ...range(59, 88), // Function Keys
];

export const numberKeys: number[] = [
  ...range(2, 11), // Number
];

export const specialCharKeys: number[] = [
  12,
  13, // -, =
  26,
  27, // [, ]
  39,
  40,
  41, // ;, ', `,
  43, // \\
  51,
  52,
  53, // ',' , . , /
];

export const arrowKeys: number[] = [
  57419, 57416, 57424, 57421, 61008, 61005, 61003, 61000,
];

export const normalKeys: number[] = [
  ...alphatbetKeys,
  ...numberKeys,
  ...specialCharKeys,
  ...functionKeys,
  14, // Backspace
  15, // Tab
  57, // Space
];

export const modifierKeys = [29, 42, 54, 56, 57, 58, 3613, 3640, 3675, 3676];

export const keycodeTableFliped = objectFlip(keycodeTable);
