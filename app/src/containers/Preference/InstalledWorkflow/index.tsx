import React, { useState } from 'react';
import styled from 'styled-components';

const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #444444;
`;

export default function General() {
  return (
    <OuterContainer>
    </OuterContainer>
  );
}
