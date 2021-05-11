import React, { useEffect } from 'react';
import { Container, Input } from './components';
import './index.global.css';
import { applyAlphaColor } from '../../utils';

type IProps = {
  alwaysFocus: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getInputProps?: Function;
  itemBackgroundColor: string;
  itemLeftPadding: number;
  searchbarFontColor: string;
  searchbarFontSize: number;
  searchbarHeight: number;
  searchWindowTransparency: number;
};

const SearchBar = (props: IProps) => {
  const {
    alwaysFocus,
    getInputProps,
    itemBackgroundColor,
    itemLeftPadding,
    searchbarFontColor,
    searchbarFontSize,
    searchbarHeight,
    searchWindowTransparency,
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
    <Container
      style={{
        height: searchbarHeight,
      }}
    >
      <Input
        className="searchBar"
        style={{
          backgroundColor: applyAlphaColor(
            itemBackgroundColor,
            searchWindowTransparency
          ),
          color: searchbarFontColor,
          fontSize: searchbarFontSize,
          paddingLeft: itemLeftPadding,
        }}
        ref={inputRef}
        type={type}
        onKeyDown={preventUpAndDownArrow}
        onBlur={alwaysFocus ? preventBlur : () => {}}
      />
    </Container>
  );
};

SearchBar.defaultProps = {
  getInputProps: undefined,
};

export default SearchBar;
