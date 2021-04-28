import TestRenderer from 'react-test-renderer';
const { act } = TestRenderer;
import { cleanup, fireEvent } from '@testing-library/react';
import { setUpHook, initialStateValues } from './utils/testUtils';

describe('useKeyCapture updates on action', () => {
  afterEach(() => cleanup());

  describe('Other types', () => {
    it('should return the initial state values', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'UNKNOWN_KEY'
        });
      });

      expect(result.current.keyData).toEqual(initialStateValues);
    });
  });

  describe('Commander key', () => {
    it('should update the key property value to "Enter", if enter key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'Enter'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        isEnter: true,
        key: 'Enter'
      });
    });
  });

  describe('Special keys', () => {
    it('should update the key property value to "Escape", if escape key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'Escape'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        isEscape: true,
        key: 'Escape'
      });
    });

    it('should update the key property value to "Shift", if shift key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'Shift'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        isShift: true,
        key: 'Shift'
      });
    });

    it('should update the key property value to "Backspace", if backspace key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'Tab'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        isTab: true,
        key: 'Tab'
      });
    });
    it('should update the key property value to "Backspace", if backspace key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'Backspace'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        isBackspace: true,
        key: 'Backspace'
      });
    });
    it('should update the key property value to "Backspace", if backspace key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'CapsLock'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        isCapsLock: true,
        key: 'CapsLock'
      });
    });

    it('should update the key property value to "Space", if space key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: ' '
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        isSpace: true,
        key: ' '
      });
    });
  });

  describe('Combination keys', () => {
    it('should update isWithShift to true, if any key is pressed along with shift key', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'a',
          shiftKey: true
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'a',
        isSmall: true,
        isWithShift: true
      });
    });

    it('should update isWithCtrl to true, if any key is pressed along with control key', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'a',
          ctrlKey: true
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'a',
        isSmall: true,
        isWithCtrl: true
      });
    });

    it('should update isWithMeta to true, if any key is pressed along with command (⌘) key', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'a',
          metaKey: true
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'a',
        isSmall: true,
        isWithMeta: true
      });
    });

    it('should update isWithAlt to true, if any key is pressed along with alt or option (⌥) key', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'a',
          altKey: true
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'a',
        isSmall: true,
        isWithAlt: true
      });
    });
  });

  describe('case sensitivity', () => {
    it('should update isCaps to true, if caps varient of a letter is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'A'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'A',
        isCaps: true
      });
    });

    it('should update isSmall to true, if small varient of a letter is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'c'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'c',
        isSmall: true
      });
    });
  });

  describe('reset prop', () => {
    it('should reset the keyData prop to initialValues', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'A'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'A',
        isCaps: true
      });

      act(() => {
        result.current.resetKeyData();
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues
      });
    });
  });

  describe('special character', () => {
    it('should update isSpecialCharacter to true, if any special character is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: '.'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: '.',
        isSpecialCharacter: true
      });
    });

    it('should update isSpecialCharacter to true, if any special character is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: '%'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: '%',
        isSpecialCharacter: true
      });
    });

    it('should update isNumber to true, if any number is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: '1'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: '1',
        isNumber: true
      });
    });
  });

  describe('Arrow keys', () => {
    it('should update isArrow to true, if any of the arrow key is pressed and isArrowLeft to true if left arrow key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'ArrowLeft'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'ArrowLeft',
        isArrow: true,
        isArrowLeft: true
      });
    });
    it('should update isArrow and isArrowRight to true, if any of the right arrow key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'ArrowRight'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'ArrowRight',
        isArrow: true,
        isArrowRight: true
      });
    });

    it('should update isArrow and isArrowUp to true, if any of the up arrow key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'ArrowUp'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'ArrowUp',
        isArrow: true,
        isArrowUp: true
      });
    });
    it('should update isArrow and isArrowRight to true, if any of the down arrow key is pressed', () => {
      const { result } = setUpHook();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'ArrowDown'
        });
      });

      expect(result.current.keyData).toEqual({
        ...initialStateValues,
        key: 'ArrowDown',
        isArrow: true,
        isArrowDown: true
      });
    });
  });
});
