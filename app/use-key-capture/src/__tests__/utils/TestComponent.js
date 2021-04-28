import React, { useRef, useEffect } from 'react';
import useKey from '../../useKeyCapture';

const TestComponent = () => {
  const { keyData, getTargetProps } = useKey();

  const inputRef = useRef(null);

  useEffect(() => {
    // console.log(inputRef.current);
  }, []);

  return (
    <div>
      <input
        data-testid="input"
        {...getTargetProps({
          ref: inputRef
        })}
      />
      <input data-testid="secondary_input" />
      {keyData.key && <small data-testid="displayDOM">{keyData.key}</small>}
    </div>
  );
};

export default TestComponent;
