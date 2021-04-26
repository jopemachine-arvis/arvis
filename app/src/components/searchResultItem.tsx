import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { StateType } from '../redux/reducers/types';

import { BsApp } from 'react-icons/bs';

type IProps = {
  title: string;
  subtitle: string;
  selected: boolean;
  icon?: string;
  arg?: any;
  text?: any;
  autocomplete?: string;
  variables?: any;
  onMouseoverHandler: Function;
  onDoubleClickHandler: Function;
};

const OuterContainer = styled.div`
  flex-direction: row;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const InnerContainer = styled.div`
  flex-direction: column;
`;

const Title = styled.div`
  word-wrap: break-word;
`;

const SubTitle = styled.div`
  word-wrap: break-word;
`;

const IconImg = styled.img``;

const searchResultItem = (props: IProps) => {
  const {
    selected,
    title,
    subtitle,
    onMouseoverHandler,
    onDoubleClickHandler,
    arg,
    icon,
    autocomplete,
    text,
    variables
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

  const iconStyle = useMemo(() => {
    return {
      width: item_height - 20,
      height: item_height - 20,
      marginRight: item_left_padding
    };
  }, []);

  const iconElem = icon ? (
    <IconImg style={iconStyle} src={icon} />
  ) : (
    <BsApp style={iconStyle} />
  );

  return (
    <OuterContainer
      style={{
        height: item_height,
        paddingLeft: item_left_padding,
        backgroundColor: selected
          ? selected_item_background_color
          : item_background_color
      }}
      onFocus={() => {}}
      onMouseOver={() => onMouseoverHandler()}
      onDoubleClick={() => onDoubleClickHandler()}
    >
      {iconElem}
      <InnerContainer>
        <Title
          style={{
            fontSize: title_font_size,
            paddingTop: item_top_padding,
            color: selected ? selected_item_font_color : item_font_color
          }}
        >
          {title}
        </Title>
        <SubTitle
          style={{
            fontSize: subtitle_font_size,
            paddingTop: item_top_padding,
            color: selected ? selected_item_font_color : item_font_color
          }}
        >
          {subtitle}
        </SubTitle>
      </InnerContainer>
    </OuterContainer>
  );
};

export default searchResultItem;
