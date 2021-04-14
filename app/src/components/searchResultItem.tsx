import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

type IProps = {
  title: string;
  subtitle: string;
  selected: boolean;
  arg?: any;
  text?: any;
  autocomplete?: string;
  variables?: any;
};

const Container = styled.div`
  flex-direction: column;
`;

const Title = styled.div`
  word-wrap: break-word;
`;

const SubTitle = styled.div`
  word-wrap: break-word;
`;

const searchResultItem = (props: IProps) => {
  const { selected, title, subtitle } = props;

  return (
    <Container>
      <Title style={{ color: selected ? 'white' : 'gray' }}>{title}</Title>
      <SubTitle style={{ color: selected ? 'white' : 'gray' }}>
        {subtitle}
      </SubTitle>
    </Container>
  );
};

export default searchResultItem;
