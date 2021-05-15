import React, { useEffect } from 'react';
import { OuterContainer, Input } from './components';

type IProps = {
  alwaysFocus: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getInputProps?: Function;
  itemLeftPadding: number;
  searchbarFontColor: string;
  searchbarFontSize: number;
  searchbarHeight: number;
};

const SearchBar = (props: IProps) => {
  const {
    alwaysFocus,
    getInputProps,
    itemLeftPadding,
    searchbarFontColor,
    searchbarFontSize,
    searchbarHeight,
  } = props;

  const { ref: inputRef, type, originalRef } = getInputProps
    ? getInputProps()
    : {
        ref: null,
        originalRef: null,
        type: '',
      };

  const preventUpAndDownArrow = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  const preventBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    originalRef && originalRef.current && originalRef.current.focus();
  };

  useEffect(() => {
    if (originalRef && originalRef.current) {
      originalRef.current.focus();
    }
  }, [originalRef]);

  return (
    <OuterContainer
      style={{
        height: searchbarHeight,
      }}
    >
      <Input
        id="searchBar"
        className="searchBar"
        style={{
          backgroundColor: 'transparent',
          color: searchbarFontColor,
          fontSize: searchbarFontSize,
          outline: 'none',
          paddingLeft: itemLeftPadding,
        }}
        ref={inputRef}
        type={type}
        onKeyDown={preventUpAndDownArrow}
        onBlur={alwaysFocus ? preventBlur : () => {}}
      />
    </OuterContainer>
  );
};

SearchBar.defaultProps = {
  getInputProps: undefined,
};

export default SearchBar;
