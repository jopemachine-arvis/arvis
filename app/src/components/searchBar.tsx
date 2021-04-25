/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  background-color: #dddddd;
  color: gray;
  font-size: 20px;
  font-weight: normal;
  height: 100%;
  padding-left: 15px;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: #333333;
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
