/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import './index.global.css';

const Input = styled.input`
  font-weight: normal;
  height: 100%;
  width: 100%;
  border-width: 0px;
`;

const Container = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

type IProps = {
  alwaysFocus: boolean;
  setInputStr: Function;
  getInputProps?: Function;

  itemBackgroundColor: string;
  itemLeftPadding: number;
  searchbarFontSize: number;
  searchbarHeight: number;
  searchbarFontColor: string;
};

const searchBar = (props: IProps) => {
  const {
    alwaysFocus,
    getInputProps,
    itemBackgroundColor,
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
        type: ''
      };

  const preventUpAndDownArrow = (e: any) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  const preventBlur = (e: any) => {
    e.preventDefault();
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
        height: searchbarHeight
      }}
    >
      <Input
        className={'searchBar'}
        style={{
          backgroundColor: itemBackgroundColor,
          color: searchbarFontColor,
          fontSize: searchbarFontSize,
          paddingLeft: itemLeftPadding,
          borderRadius: 10
        }}
        ref={inputRef}
        type={type}
        onKeyDown={preventUpAndDownArrow}
        onBlur={alwaysFocus ? preventBlur : () => {}}
      />
    </Container>
  );
};

export default searchBar;
