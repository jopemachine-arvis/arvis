"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyReducer;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _useKeyCaptureUtils = require("./useKeyCaptureUtils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function keyReducer(state, action) {
  switch (action.type) {
    case _useKeyCaptureUtils.useKeyActionTypes.ESCAPE_KEY:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isEscape: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.ENTER_KEY:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isEnter: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.CAPSLOCK:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isCapsLock: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.BACKSPACE:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isBackspace: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.SHIFT:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isShift: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.CAPS_ALPHABET:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isCaps: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.SMALL_ALPHABET:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isSmall: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.NUMBER:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isNumber: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.SPACE:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isSpace: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.TAB:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isTab: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.SPECIAL:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isSpecialCharacter: true
        }, action.payload);
      }

    case _useKeyCaptureUtils.useKeyActionTypes.ARROWS:
      {
        return _objectSpread({}, _useKeyCaptureUtils.initialState, {
          isArrow: true
        }, action.payload);
      }

    default:
      return _objectSpread({}, _useKeyCaptureUtils.initialState);
  }
}