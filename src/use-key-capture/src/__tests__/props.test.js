import { cleanup } from '@testing-library/react';
import { setUpHook, initialStateValues } from './utils/testUtils';

describe('useKeyCapture', () => {
  afterEach(() => cleanup());

  describe('props', () => {
    it('are present', () => {
      const { result } = setUpHook();
      expect(result.current.keyData).toBeTruthy();
      expect(result.current.resetKeyData).toBeTruthy();
      expect(result.current.getTargetProps).toBeTruthy();
    });
  });

  describe('prop getters', () => {
    it('are returned as functions', () => {
      const { result } = setUpHook();
      expect(result.current.getTargetProps).toBeInstanceOf(Function);
      expect(result.current.resetKeyData).toBeInstanceOf(Function);
    });
  });

  it('should have have correct initial state', () => {
    const { result } = setUpHook();

    expect(result.current.keyData).toEqual(initialStateValues);
  });
});
