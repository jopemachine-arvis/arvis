import React, { useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import StyledInput from '@components/styledInput';
import './index.css';

export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateSnippet,
  type,
}: {
  value: any;
  row: any;
  column: any;
  updateSnippet: any;
  type: string;
}) => {
  const [value, setValue] = useState<string | boolean>(initialValue);
  const [focusedValue, setFocusedValue] =
    useState<string | boolean>(initialValue);

  const onCheckboxChangeHandler = (e: any) => {
    updateSnippet(index, id, value);
  };

  const onChangeHandler = (e: any) => {
    setValue(e.currentTarget.value);
  };

  const onBlurHandler = () => {
    if (focusedValue !== value) {
      updateSnippet(index, id, value);
    }
  };

  const onFocusHandler = () => {
    setFocusedValue(value);
  };

  useEffect(() => {
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

  if (id === 'useAutoExpand') {
    return (
      <Input
        type="checkbox"
        checked={value as boolean}
        onChange={onCheckboxChangeHandler}
      />
    );
  }

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
