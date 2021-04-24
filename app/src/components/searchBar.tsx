/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  font-weight: normal;
  color: gray;
`;

const Container = styled.div`
  width: 100vh;
  justify-content: center;
  align-items: center;
`;

const searchBar = (props: any) => {
  const inputProps = props.getInputProps();

  const preventUpAndDownArrow = (e: any) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
  };

  return (
    <Container>
      <Input {...inputProps} onKeyDown={preventUpAndDownArrow} />
    </Container>
  );
};

export default searchBar;
