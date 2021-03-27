import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

const Text = styled.div`
  fontweight: bold;
  color: white;
`;

const PlaceHolder = styled.div`
  fontweight: normal;
  color: gray;
`;

const Container = styled.div`
  width: 100vh;
`;

const searchBar = (props: any) => {
  const { input } = props;

  const inputElem =
    input !== '' ? (
      <Text>{`${input}`}</Text>
    ) : (
      <PlaceHolder>Search..</PlaceHolder>
    );

  return <Container>{inputElem}</Container>;
};

export default searchBar;
