/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import './index.global.css';

const Input = styled.input`
  background-color: #444444;
  color: #ffffff;
  font-size: 20px;
  font-weight: normal;
  height: 100%;
  padding-left: 15px;
  width: 100%;
  border-width: 0px;
`;

const Container = styled.div`
  width: 100%;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: #333333;
`;

const searchBar = (props: any) => {
  const { ref: inputRef, type, originalRef } = props.getInputProps();

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

  const onBlurHandler = (e: any) => {
    e.preventDefault();
    originalRef.current.focus();
  };

  return (
    <Container>
      <Input
        ref={inputRef}
        type={type}
        onKeyDown={preventUpAndDownArrow}
        onBlur={onBlurHandler}
      />
    </Container>
  );
};

export default searchBar;
