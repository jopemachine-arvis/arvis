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
  // eslint-disable-next-line react/destructuring-assignment
  const inputProps = props.getInputProps();

  return (
    <Container>
      <Input {...inputProps} />
    </Container>
  );
};

export default searchBar;
