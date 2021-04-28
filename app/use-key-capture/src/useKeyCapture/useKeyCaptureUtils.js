import { useCallback } from 'react';

const initialState = {
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

const useKeyActionTypes = {
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

const modifierKeys = {
  ctrlKey: 'Ctrl',
  shiftKey: 'Shift',
  altKey: 'Alt',
  metaKey: 'Meta'
};

const keyCodeMapper = {
  Enter: useKeyActionTypes.ENTER_KEY,
  Escape: useKeyActionTypes.ESCAPE_KEY,
  Tab: useKeyActionTypes.TAB,
  CapsLock: useKeyActionTypes.CAPSLOCK,
  Shift: useKeyActionTypes.SHIFT,
  Backspace: useKeyActionTypes.BACKSPACE,
  // eslint-disable-next-line no-useless-computed-key
  [' ']: useKeyActionTypes.SPACE
};

const getArrowKeysPayload = key => {
  return {
    [`is${key}`]: true
  };
};

const isCapitalLetterPressed = key => /^[A-Z]$/.test(key);
const isSmallLetterPressed = key => /^[a-z]$/.test(key);
const isNumberPressed = key => /^[0-9]/.test(key);
const isSpecialCharacter = key =>
  /^[!@#$%^&*()_+<>?:"{}[\]';.,|/\-\\=_+~`]/.test(key);

const isSpecialCharacterPressed = key => {
  return (
    !isCapitalLetterPressed(key) &&
    !isSmallLetterPressed(key) &&
    !isNumberPressed(key) &&
    !keyCodeMapper[key] &&
    isSpecialCharacter(key)
  );
};

const getModifierPayload = eventDetails => {
  let modifierPayloadObj = {};
  const modifierObjKeys = Object.keys(modifierKeys);

  for (let key of modifierObjKeys) {
    if (eventDetails[key]) {
      modifierPayloadObj[`isWith${modifierKeys[key]}`] = true;
    }
  }

  return modifierPayloadObj;
};

/**
 * Returns the action type for the key pressed
 * @param {KeyboardEvent} eventDetails keyboard event object
 * @return {String}  action type
 */
const getAction = eventDetails => {
  if (!eventDetails) {
    throw new Error('Event called with no details');
  }

  const { key } = eventDetails;

  if (key.includes('Arrow')) {
    return {
      type: useKeyActionTypes.ARROWS,
      payload: {
        ...getArrowKeysPayload(key),
        ...getModifierPayload(eventDetails),
        key
      }
    };
  }

  let type;

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
    type,
    payload: { ...getModifierPayload(eventDetails), key }
  };
};

const targetItemPropsDefaultValue = {
  type: 'text'
};

function handleRefAssignment(...refs) {
  return node => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
}

const useEnhancedReducer = reducer =>
  useCallback(
    (state, action) => {
      return reducer(state, action);
    },
    [reducer]
  );

export {
  getAction,
  initialState,
  targetItemPropsDefaultValue,
  useKeyActionTypes,
  useEnhancedReducer,
  handleRefAssignment
};
