"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleRefAssignment = handleRefAssignment;
exports.useEnhancedReducer = exports.useKeyActionTypes = exports.targetItemPropsDefaultValue = exports.initialState = exports.getAction = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {
  // Pressed key
  key: null,
  // Command Keys
  isEnter: false,
  isBackspace: false,
  isEscape: false,
  isCapsLock: false,
  isTab: false,
  isSpace: false,
  // Function keys
  isFunctionKey: false,
  // Arrow keys
  isArrow: false,
  isArrowRight: false,
  isArrowLeft: false,
  isArrowUp: false,
  isArrowDown: false,
  // Modifier keys
  isWithShift: false,
  isWithCtrl: false,
  isWithMeta: false,
  isWithAlt: false,
  // Character varients
  isCaps: false,
  isSmall: false,
  isNumber: false,
  // For special character
  isSpecialCharacter: false
};
exports.initialState = initialState;
var useKeyActionTypes = {
  ENTER_KEY: 'ENTER_KEY',
  ESCAPE_KEY: 'ESCAPE_KEY',
  RESET_CAPTURES: 'RESET_CAPTURES',
  CAPS_ALPHABET: 'CAPS',
  SMALL_ALPHABET: 'SMALL',
  NUMBER: 'NUMBER',
  SPACE: 'SPACE',
  ARROWS: 'ARROWS',
  SPECIAL: 'SPECIAL',
  TAB: 'TAB',
  CAPSLOCK: 'CAPSLOCK',
  SHIFT: 'SHIFT',
  BACKSPACE: 'BACKSPACE'
};
exports.useKeyActionTypes = useKeyActionTypes;
var modifierKeys = {
  ctrlKey: 'Ctrl',
  shiftKey: 'Shift',
  altKey: 'Alt',
  metaKey: 'Meta'
};
var keyCodeMapper = (0, _defineProperty2.default)({
  Enter: useKeyActionTypes.ENTER_KEY,
  Escape: useKeyActionTypes.ESCAPE_KEY,
  Tab: useKeyActionTypes.TAB,
  CapsLock: useKeyActionTypes.CAPSLOCK,
  Shift: useKeyActionTypes.SHIFT,
  Backspace: useKeyActionTypes.BACKSPACE
}, ' ', useKeyActionTypes.SPACE);

var getArrowKeysPayload = function getArrowKeysPayload(key) {
  return (0, _defineProperty2.default)({}, "is".concat(key), true);
};

var isCapitalLetterPressed = function isCapitalLetterPressed(key) {
  return /^[A-Z]$/.test(key);
};

var isSmallLetterPressed = function isSmallLetterPressed(key) {
  return /^[a-z]$/.test(key);
};

var isNumberPressed = function isNumberPressed(key) {
  return /^[0-9]/.test(key);
};

var isSpecialCharacter = function isSpecialCharacter(key) {
  return /^[!@#$%^&*()_+<>?:"{}[\]';.,|/\-\\=_+~`]/.test(key);
};

var isSpecialCharacterPressed = function isSpecialCharacterPressed(key) {
  return !isCapitalLetterPressed(key) && !isSmallLetterPressed(key) && !isNumberPressed(key) && !keyCodeMapper[key] && isSpecialCharacter(key);
};

var getModifierPayload = function getModifierPayload(eventDetails) {
  var modifierPayloadObj = {};
  var modifierObjKeys = Object.keys(modifierKeys);

  for (var _i = 0, _modifierObjKeys = modifierObjKeys; _i < _modifierObjKeys.length; _i++) {
    var key = _modifierObjKeys[_i];

    if (eventDetails[key]) {
      modifierPayloadObj["isWith".concat(modifierKeys[key])] = true;
    }
  }

  return modifierPayloadObj;
};
/**
 * Returns the action type for the key pressed
 * @param {KeyboardEvent} eventDetails keyboard event object
 * @return {String}  action type
 */


var getAction = function getAction(eventDetails) {
  if (!eventDetails) {
    throw new Error('Event called with no details');
  }

  var key = eventDetails.key;

  if (key.includes('Arrow')) {
    return {
      type: useKeyActionTypes.ARROWS,
      payload: _objectSpread({}, getArrowKeysPayload(key), {}, getModifierPayload(eventDetails), {
        key: key
      })
    };
  }

  var type;
  if (keyCodeMapper[key]) type = keyCodeMapper[key];

  if (isCapitalLetterPressed(key)) {
    type = useKeyActionTypes.CAPS_ALPHABET;
  }

  if (isSmallLetterPressed(key)) {
    type = useKeyActionTypes.SMALL_ALPHABET;
  }

  if (isNumberPressed(key)) {
    type = useKeyActionTypes.NUMBER;
  }

  if (!type && isSpecialCharacterPressed(key)) {
    type = useKeyActionTypes.SPECIAL;
  }

  if (!type) {
    type = 'SOME_OTHER_KEY';
  }

  return {
    type: type,
    payload: _objectSpread({}, getModifierPayload(eventDetails), {
      key: key
    })
  };
};

exports.getAction = getAction;
var targetItemPropsDefaultValue = {
  type: 'text'
};
exports.targetItemPropsDefaultValue = targetItemPropsDefaultValue;

function handleRefAssignment() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return function (node) {
    refs.forEach(function (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
}

var useEnhancedReducer = function useEnhancedReducer(reducer) {
  return (0, _react.useCallback)(function (state, action) {
    return reducer(state, action);
  }, [reducer]);
};

exports.useEnhancedReducer = useEnhancedReducer;