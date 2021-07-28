/* eslint-disable dot-notation */
import { useEffect, useReducer, useRef, useState } from 'react';
import reducer from './useKeyCaptureReducer';
import { usePreviousKey } from './usePreviousKey';

import {
  initialState,
  getAction,
  useKeyActionTypes,
  useEnhancedReducer,
  targetItemPropsDefaultValue,
  handleRefAssignment,
} from './useKeyCaptureUtils';

const doubleKeyRecognitionInterval = 200;

const doubleKeyRecognizer = ['Meta', 'Control', 'Alt', 'Shift'];

function useKeys() {
  const [keyData, dispatch] = useReducer(
    useEnhancedReducer(reducer),
    initialState
  );

  const prevKey = usePreviousKey(keyData);
  const prevKeyRef = useRef(prevKey);
  prevKeyRef.current = prevKey;

  const [doubleKeyTimerValid, setDoubleKeyTimerValid] = useState(false);
  const doubleKeyTimerValidRef = useRef(doubleKeyTimerValid);
  doubleKeyTimerValidRef.current = doubleKeyTimerValid;

  const [doubleKeyRecognitionTimer, setDoubleKeyRecognitionTimer] =
    useState(null);

  const targetItemRef = useRef(null);

  const doubleKeyPressHandler = (event, action) => {
    // Add double key event
    const doubleKeyIsPressed = () => {
      let ret = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const key of doubleKeyRecognizer) {
        if (event.key === key && prevKeyRef.current[`is${key}`]) ret = true;
      }
      return ret;
    };

    if (doubleKeyTimerValidRef.current && doubleKeyIsPressed()) {
      action.payload.doubleKeyPressed = true;
    }

    return action;
  };

  const dispatchWithActionDetails = (event) => {
    dispatch(doubleKeyPressHandler(event, getAction(event)));
  };

  /**
   * It resets all state values to initial values
   */
  const resetKeyData = () => {
    dispatch({
      type: useKeyActionTypes.RESET_CAPTURES,
    });

    if (targetItemRef && targetItemRef.current) {
      targetItemRef.current.value = '';
    }
  };

  useEffect(() => {
    if (keyData.key !== null) {
      if (doubleKeyRecognitionTimer) clearInterval(doubleKeyRecognitionTimer);
      setDoubleKeyTimerValid(true);
      setDoubleKeyRecognitionTimer(
        setTimeout(() => {
          setDoubleKeyTimerValid(false);
        }, doubleKeyRecognitionInterval)
      );
    }
  }, [keyData]);

  useEffect(() => {
    const listenerItem = targetItemRef.current || document;
    listenerItem.addEventListener('keydown', dispatchWithActionDetails);

    return () => {
      listenerItem.removeEventListener('keydown', dispatchWithActionDetails);
    };
  }, []);

  const getTargetProps = ({ ref, type } = {}) => {
    return {
      type: type || targetItemPropsDefaultValue.type,
      ref: handleRefAssignment(ref, (targetItemNode) => {
        targetItemRef.current = targetItemNode;
      }),
      originalRef: targetItemRef,
    };
  };

  return { keyData, resetKeyData, getTargetProps };
}

export default useKeys;
