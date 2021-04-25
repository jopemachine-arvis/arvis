import React, { useEffect, useState } from 'react';
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
  height: 60px;
  width: 100%;
  background-color: #444444;
`;

const Title = styled.div`
  word-wrap: break-word;
  padding-left: 15px;
  padding-top: 7px;
  font-size: 15px;
`;

const SubTitle = styled.div`
  word-wrap: break-word;
  padding-left: 15px;
  padding-top: 7px;
  font-size: 10px;
`;

const searchResultItem = (props: IProps) => {
  const { selected, title, subtitle } = props;

  return (
    <Container style={{ backgroundColor: selected ? '#222222' : '#444444' }}>
      <Title style={{ color: selected ? 'white' : 'gray' }}>{title}</Title>
      <SubTitle style={{ color: selected ? 'white' : 'gray' }}>
        {subtitle}
      </SubTitle>
    </Container>
  );
};

export default searchResultItem;
