/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { StateType } from '../../redux/reducers/types';
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

const searchBar = (props: any) => {
  const { ref: inputRef, type, originalRef } = props.getInputProps();

  const {
    item_background_color,
    item_font_color,
    item_left_padding,
    searchbar_font_size,
    searchbar_height
  } = useSelector((state: StateType) => state.uiConfig);

  const preventUpAndDownArrow = (e: any) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (originalRef && originalRef.current) {
      originalRef.current.focus();
    }
  }, [originalRef]);

  const preventBlur = (e: any) => {
    e.preventDefault();
    originalRef.current.focus();
  };

  return (
    <Container
      style={{
        height: searchbar_height
      }}
    >
      <Input
        style={{
          backgroundColor: item_background_color,
          color: item_font_color,
          fontSize: searchbar_font_size,
          paddingLeft: item_left_padding
        }}
        ref={inputRef}
        type={type}
        onKeyDown={preventUpAndDownArrow}
        onBlur={preventBlur}
      />
    </Container>
  );
};

export default searchBar;
