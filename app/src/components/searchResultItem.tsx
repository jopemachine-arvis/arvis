/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { StateType } from '../redux/reducers/types';

type IProps = {
  title: string;
  subtitle: string;
  selected: boolean;
  arg?: any;
  text?: any;
  autocomplete?: string;
  variables?: any;
  onMouseoverHandler: Function;
  onDoubleClickHandler: Function;
};

const Container = styled.div`
  flex-direction: column;
  width: 100%;
`;

const Title = styled.div`
  word-wrap: break-word;
`;

const SubTitle = styled.div`
  word-wrap: break-word;
`;

const searchResultItem = (props: IProps) => {
  const {
    selected,
    title,
    subtitle,
    onMouseoverHandler,
    onDoubleClickHandler
  } = props;

  const {
    item_background_color,
    item_font_color,
    item_height,
    item_left_padding,
    item_top_padding,
    selected_item_background_color,
    selected_item_font_color,
    subtitle_font_size,
    title_font_size
  } = useSelector((state: StateType) => state.uiConfig);

  return (
    <Container
      style={{
        height: item_height,
        backgroundColor: selected
          ? selected_item_background_color
          : item_background_color
      }}
      onMouseOver={() => onMouseoverHandler()}
      onDoubleClick={() => onDoubleClickHandler()}
    >
      <Title
        style={{
          fontSize: title_font_size,
          paddingTop: item_top_padding,
          paddingLeft: item_left_padding,
          color: selected ? selected_item_font_color : item_font_color
        }}
      >
        {title}
      </Title>
      <SubTitle
        style={{
          fontSize: subtitle_font_size,
          paddingTop: item_top_padding,
          paddingLeft: item_left_padding,
          color: selected ? selected_item_font_color : item_font_color
        }}
      >
        {subtitle}
      </SubTitle>
    </Container>
  );
};

export default searchResultItem;
