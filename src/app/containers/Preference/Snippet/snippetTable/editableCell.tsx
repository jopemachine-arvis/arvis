import React, { useState } from 'react';
import StyledInput from '@components/styledInput';
import './index.css';

export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateJson,
  type,
}: {
  value: any;
  row: any;
  column: any;
  updateJson: any;
  type: string;
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [focusedValue, setFocusedValue] = useState<string>(initialValue);

  const onChangeHandler = (e: any) => {
    setValue(e.currentTarget.value);
  };

  const onBlurHandler = () => {
    if (focusedValue !== value) {
      updateJson(index, id, value);
    }
  };

  const onFocusHandler = () => {
    setFocusedValue(value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const style = {
    height: 20,
    padding: 3,
    border: 1,
    backgroundColor: '#1f2228',
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    textShadow: undefined,
  };

  return (
    <StyledInput
      className="snippetItem"
      style={style}
      value={value}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
    />
  );
};
