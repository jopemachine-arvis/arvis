/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';

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

const Input = styled.input`
  font-weight: normal;
  color: gray;
`;

const Container = styled.div`
  width: 100vh;
  justify-content: center;
  align-items: center;
`;

export default searchBar;
