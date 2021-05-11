/* eslint-disable no-bitwise */
// https://github.com/kwhat/libuiohook/blob/master/include/uiohook.h

/* Begin Virtual Key Codes */
export const VC_ESCAPE = 0x0001;

// Begin Function Keys
export const VC_F1 = 0x003b;
export const VC_F2 = 0x003c;
export const VC_F3 = 0x003d;
export const VC_F4 = 0x003e;
export const VC_F5 = 0x003f;
export const VC_F6 = 0x0040;
export const VC_F7 = 0x0041;
export const VC_F8 = 0x0042;
export const VC_F9 = 0x0043;
export const VC_F10 = 0x0044;
export const VC_F11 = 0x0057;
export const VC_F12 = 0x0058;

export const VC_F13 = 0x005b;
export const VC_F14 = 0x005c;
export const VC_F15 = 0x005d;
export const VC_F16 = 0x0063;
export const VC_F17 = 0x0064;
export const VC_F18 = 0x0065;
export const VC_F19 = 0x0066;
export const VC_F20 = 0x0067;
export const VC_F21 = 0x0068;
export const VC_F22 = 0x0069;
export const VC_F23 = 0x006a;
export const VC_F24 = 0x006b;
// End Function Keys

// Begin Alphanumeric Zone
export const VC_BACKQUOTE = 0x0029;

export const VC_1 = 0x0002;
export const VC_2 = 0x0003;
export const VC_3 = 0x0004;
export const VC_4 = 0x0005;
export const VC_5 = 0x0006;
export const VC_6 = 0x0007;
export const VC_7 = 0x0008;
export const VC_8 = 0x0009;
export const VC_9 = 0x000a;
export const VC_0 = 0x000b;

export const VC_MINUS = 0x000c; // '-'
export const VC_EQUALS = 0x000d; // '='
export const VC_BACKSPACE = 0x000e;

export const VC_TAB = 0x000f;
export const VC_CAPS_LOCK = 0x003a;

export const VC_A = 0x001e;
export const VC_B = 0x0030;
export const VC_C = 0x002e;
export const VC_D = 0x0020;
export const VC_E = 0x0012;
export const VC_F = 0x0021;
export const VC_G = 0x0022;
export const VC_H = 0x0023;
export const VC_I = 0x0017;
export const VC_J = 0x0024;
export const VC_K = 0x0025;
export const VC_L = 0x0026;
export const VC_M = 0x0032;
export const VC_N = 0x0031;
export const VC_O = 0x0018;
export const VC_P = 0x0019;
export const VC_Q = 0x0010;
export const VC_R = 0x0013;
export const VC_S = 0x001f;
export const VC_T = 0x0014;
export const VC_U = 0x0016;
export const VC_V = 0x002f;
export const VC_W = 0x0011;
export const VC_X = 0x002d;
export const VC_Y = 0x0015;
export const VC_Z = 0x002c;

export const VC_OPEN_BRACKET = 0x001a; // '['
export const VC_CLOSE_BRACKET = 0x001b; // ']'
export const VC_BACK_SLASH = 0x002b; // '\'

export const VC_SEMICOLON = 0x0027; // ';'
export const VC_QUOTE = 0x0028;
export const VC_ENTER = 0x001c;

export const VC_COMMA = 0x0033; // ','
export const VC_PERIOD = 0x0034; // '.'
export const VC_SLASH = 0x0035; // '/'

export const VC_SPACE = 0x0039;
// End Alphanumeric Zone

export const VC_PRINTSCREEN = 0x0e37;
export const VC_SCROLL_LOCK = 0x0046;
export const VC_PAUSE = 0x0e45;

// Begin Edit Key Zone
export const VC_INSERT = 0x0e52;
export const VC_DELETE = 0x0e53;
export const VC_HOME = 0x0e47;
export const VC_END = 0x0e4f;
export const VC_PAGE_UP = 0x0e49;
export const VC_PAGE_DOWN = 0x0e51;
// End Edit Key Zone

// Begin Cursor Key Zone
export const VC_UP = 0xe048;
export const VC_LEFT = 0xe04b;
export const VC_CLEAR = 0xe04c;
export const VC_RIGHT = 0xe04d;
export const VC_DOWN = 0xe050;
// End Cursor Key Zone

// Begin Numeric Zone
export const VC_NUM_LOCK = 0x0045;
export const VC_KP_DIVIDE = 0x0e35;
export const VC_KP_MULTIPLY = 0x0037;
export const VC_KP_SUBTRACT = 0x004a;
export const VC_KP_EQUALS = 0x0e0d;
export const VC_KP_ADD = 0x004e;
export const VC_KP_ENTER = 0x0e1c;
export const VC_KP_SEPARATOR = 0x0053;

export const VC_KP_1 = 0x004f;
export const VC_KP_2 = 0x0050;
export const VC_KP_3 = 0x0051;
export const VC_KP_4 = 0x004b;
export const VC_KP_5 = 0x004c;
export const VC_KP_6 = 0x004d;
export const VC_KP_7 = 0x0047;
export const VC_KP_8 = 0x0048;
export const VC_KP_9 = 0x0049;
export const VC_KP_0 = 0x0052;

export const VC_KP_END = 0xee00 | VC_KP_1;
export const VC_KP_DOWN = 0xee00 | VC_KP_2;
export const VC_KP_PAGE_DOWN = 0xee00 | VC_KP_3;
export const VC_KP_LEFT = 0xee00 | VC_KP_4;
export const VC_KP_CLEAR = 0xee00 | VC_KP_5;
export const VC_KP_RIGHT = 0xee00 | VC_KP_6;
export const VC_KP_HOME = 0xee00 | VC_KP_7;
export const VC_KP_UP = 0xee00 | VC_KP_8;
export const VC_KP_PAGE_UP = 0xee00 | VC_KP_9;
export const VC_KP_INSERT = 0xee00 | VC_KP_0;
export const VC_KP_DELETE = 0xee00 | VC_KP_SEPARATOR;
// End Numeric Zone

// Begin Modifier and Control Keys
export const VC_SHIFT_L = 0x002a;
export const VC_SHIFT_R = 0x0036;
export const VC_CONTROL_L = 0x001d;
export const VC_CONTROL_R = 0x0e1d;
export const VC_ALT_L = 0x0038; // Option or Alt Key
export const VC_ALT_R = 0x0e38; // Option or Alt Key
export const VC_META_L = 0x0e5b; // Windows or Command Key
export const VC_META_R = 0x0e5c; // Windows or Command Key
export const VC_CONTEXT_MENU = 0x0e5d;
// End Modifier and Control Keys

// Begin Media Control Keys
export const VC_POWER = 0xe05e;
export const VC_SLEEP = 0xe05f;
export const VC_WAKE = 0xe063;

export const VC_MEDIA_PLAY = 0xe022;
export const VC_MEDIA_STOP = 0xe024;
export const VC_MEDIA_PREVIOUS = 0xe010;
export const VC_MEDIA_NEXT = 0xe019;
export const VC_MEDIA_SELECT = 0xe06d;
export const VC_MEDIA_EJECT = 0xe02c;

export const VC_VOLUME_MUTE = 0xe020;
export const VC_VOLUME_UP = 0xe030;
export const VC_VOLUME_DOWN = 0xe02e;

export const VC_APP_MAIL = 0xe06c;
export const VC_APP_CALCULATOR = 0xe021;
export const VC_APP_MUSIC = 0xe03c;
export const VC_APP_PICTURES = 0xe064;

export const VC_BROWSER_SEARCH = 0xe065;
export const VC_BROWSER_HOME = 0xe032;
export const VC_BROWSER_BACK = 0xe06a;
export const VC_BROWSER_FORWARD = 0xe069;
export const VC_BROWSER_STOP = 0xe068;
export const VC_BROWSER_REFRESH = 0xe067;
export const VC_BROWSER_FAVORITES = 0xe066;
// End Media Control Keys

// Begin Japanese Language Keys
export const VC_KATAKANA = 0x0070;
export const VC_UNDERSCORE = 0x0073;
export const VC_FURIGANA = 0x0077;
export const VC_KANJI = 0x0079;
export const VC_HIRAGANA = 0x007b;
export const VC_YEN = 0x007d;
export const VC_KP_COMMA = 0x007e;
// End Japanese Language Keys

// Begin Sun keyboards
export const VC_SUN_HELP = 0xff75;

export const VC_SUN_STOP = 0xff78;
export const VC_SUN_PROPS = 0xff76;
export const VC_SUN_FRONT = 0xff77;
export const VC_SUN_OPEN = 0xff74;
export const VC_SUN_FIND = 0xff7e;
export const VC_SUN_AGAIN = 0xff79;
export const VC_SUN_UNDO = 0xff7a;
export const VC_SUN_COPY = 0xff7c;
export const VC_SUN_INSERT = 0xff7d;
export const VC_SUN_CUT = 0xff7b;
// End Sun keyboards

export const VC_UNDEFINED = 0x0000; // KeyCode Unknown

export const CHAR_UNDEFINED = 0xffff; // CharCode Unknown
