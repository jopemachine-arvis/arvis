import React, { useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import StyledInput from '@components/styledInput';
import './index.css';

type SnippetTableCellOptions = {
  collectionInfo?: SnippetCollectionInfo;
  onDoubleClickHandler?: () => void;
};

export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateSnippet,
  type,
  options = {},
}: {
  value: any;
  row: any;
  column: any;
  updateSnippet: any;
  type: string;
  options: SnippetTableCellOptions;
}) => {
  const { collectionInfo, onDoubleClickHandler } = options;

  const prefix = collectionInfo
    ? collectionInfo.snippetKeywordPrefix ?? ''
    : '';
  const suffix = collectionInfo
    ? collectionInfo.snippetKeywordSuffix ?? ''
    : '';

  const [value, setValue] = useState<string | boolean>(initialValue);
  const [focusedValue, setFocusedValue] =
    useState<string | boolean>(initialValue);

  const [isFocused, setIsFocused] = useState<boolean>(false);

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
    setIsFocused(false);
  };

  const onFocusHandler = () => {
    setFocusedValue(value);
    setIsFocused(true);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (id === 'useAutoExpand') {
    return (
      <Input
        style={{ width: 16 }}
        type="checkbox"
        checked={value as boolean}
        onChange={onCheckboxChangeHandler}
      />
    );
  }

  let targetValue = value;
  if (id === 'keyword' && !isFocused) {
    targetValue = `${prefix}${value}${suffix}`;
  }

  return (
    <StyledInput
      className="snippetItem"
      value={targetValue}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
      onDoubleClick={onDoubleClickHandler}
      style={{
        height: 20,
        padding: 3,
        border: 1,
        backgroundColor: '#1f2228',
        fontSize: 14,
        color: '#fff',
        textAlign: 'left',
        textShadow: undefined,
      }}
    />
  );
};
