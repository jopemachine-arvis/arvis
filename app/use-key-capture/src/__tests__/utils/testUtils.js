import { renderHook } from '@testing-library/react-hooks';
import useKeyCapture from '../../index';
import { initialState } from '../../useKeyCapture/useKeyCaptureUtils';

const setUpHook = () => renderHook(() => useKeyCapture());

const initialStateValues = initialState;

export { setUpHook, initialStateValues };
