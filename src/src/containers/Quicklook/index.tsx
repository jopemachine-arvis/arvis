import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const OuterContainer = styled.div`
  height: 0;
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: transparent;
  opacity: 0.5;
`;

export default function QuicklookWindow() {
  return (
    <OuterContainer>
    </OuterContainer>
  );
}
