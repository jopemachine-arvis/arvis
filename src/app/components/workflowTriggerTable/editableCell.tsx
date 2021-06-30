import React, { useState } from 'react';
import StyledInput from '../styledInput';
import HotkeyRecordForm from '../hotkeyRecordForm';
import './index.global.css';

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

  const onHotkeyChangeHandler = (e: any) => {
    setValue(e.currentTarget.value);
    updateJson(index, id, e.currentTarget.value);
  };

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

  const getTypeColor = () => {
    switch (value) {
      case 'keyword':
        return '#3eb7bb88';
      case 'hotkey':
        return '#b8ad3d88';
      case 'scriptFilter':
        return '#bb7d3e88';
      default:
        return undefined;
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

  const getFontSize = () => {
    switch (id) {
      case 'type':
        return 12;
      case 'command':
        return 14;
      case 'description':
        return 14;
      default:
        return 16;
    }
  };

  const getTextColor = () => {
    return id === 'command' ? '#888888' : '#fff';
  };

  const getTextAlign = () => {
    return id === 'description' ? 'left' : 'center';
  };

  const backgroundColor = id === 'type' ? getTypeColor() : '#1f2228';
  const indicatedValue = id === 'type' ? getTypeValue() : value;

  const style = {
    height: 20,
    padding: 3,
    border: 1,
    backgroundColor,
    fontSize: getFontSize(),
    color: getTextColor(),
    textAlign: getTextAlign(),
    textShadow: undefined,
  };

  if (id === 'command' && type === 'hotkey') {
    return (
      <HotkeyRecordForm
        className="workflowTriggerTableItem"
        canBeEmpty
        hotkey={indicatedValue ?? ''}
        onHotkeyChange={onHotkeyChangeHandler}
        style={style}
      />
    );
  }

  return (
    <StyledInput
      className="workflowTriggerTableItem"
      disabled={id !== 'command'}
      style={style}
      value={indicatedValue}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
    />
  );
};
