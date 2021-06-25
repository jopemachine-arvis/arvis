import React, { useState } from 'react';
import StyledInput from '../styledInput';
import './index.global.css';

export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateJson,
}: {
  value: any;
  row: any;
  column: any;
  updateJson: any;
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [focusedValue, setFocusedValue] = useState<string>(initialValue);

  const onChangeHandler = (e: any) => {
    setValue(e.target.value);
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

  const getTypeColor = () => {
    switch (value) {
      case 'keyword':
        return '#3eb7bb';
      case 'hotkey':
        return '#b8ad3d';
      case 'scriptFilter':
        return '#bb7d3e';
      default:
        return '#888';
    }
  };

  const getTypeValue = () => {
    switch (value) {
      case 'keyword':
        return 'Keyword';
      case 'hotkey':
        return 'Hotkey';
      case 'scriptFilter':
        return 'Script Filter';
      default:
        return undefined;
    }
  };

  const color = id === 'type' ? getTypeColor() : '#888';
  const indicatedValue = id === 'type' ? getTypeValue() : value;

  return (
    <StyledInput
      className="workflowTriggerTableItem"
      disabled={id !== 'command'}
      style={{ border: 1, color }}
      value={indicatedValue}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
    />
  );
};
