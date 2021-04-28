import { initialState, useKeyActionTypes } from './useKeyCaptureUtils';

export default function keyReducer(state, action) {
  switch (action.type) {
    case useKeyActionTypes.ESCAPE_KEY: {
      return {
        ...initialState,
        isEscape: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.ENTER_KEY: {
      return {
        ...initialState,
        isEnter: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.CAPSLOCK: {
      return {
        ...initialState,
        isCapsLock: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.BACKSPACE: {
      return {
        ...initialState,
        isBackspace: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.SHIFT: {
      return {
        ...initialState,
        isShift: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.CAPS_ALPHABET: {
      return {
        ...initialState,
        isCaps: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.SMALL_ALPHABET: {
      return {
        ...initialState,
        isSmall: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.NUMBER: {
      return {
        ...initialState,
        isNumber: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.SPACE: {
      return {
        ...initialState,
        isSpace: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.TAB: {
      return {
        ...initialState,
        isTab: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.SPECIAL: {
      return {
        ...initialState,
        isSpecialCharacter: true,
        ...action.payload
      };
    }

    case useKeyActionTypes.ARROWS: {
      return {
        ...initialState,
        isArrow: true,
        ...action.payload
      };
    }
    default:
      return { ...initialState };
  }
}
