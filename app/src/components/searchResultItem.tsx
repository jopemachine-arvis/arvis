import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { BsApp } from 'react-icons/bs';
import { BiErrorAlt } from 'react-icons/bi';
import { StateType } from '../redux/reducers/types';

import useKey from '../../use-key-capture/_dist/index';

const clipboardy = require('clipboardy');

type IProps = {
  title: string;
  subtitle: string;
  selected: boolean;
  icon?: string;
  arg?: any;
  text?: any;
  autocomplete?: string;
  variables?: any;
  valid?: boolean;
  onMouseoverHandler: Function;
  onDoubleClickHandler: Function;
};

const OuterContainer = styled.div`
  flex-direction: row;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

const InnerContainer = styled.div`
  flex-direction: column;
`;

const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const SubTitle = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
    variables,
    valid
  } = props;

  const {
    item_background_color,
    item_font_color,
    item_height,
    item_left_padding,
    item_title_subtitle_margin,
    icon_right_margin,
    selected_item_background_color,
    selected_item_font_color,
    subtitle_font_size,
    title_font_size
  } = useSelector((state: StateType) => state.uiConfig);

  const { keyData } = useKey();

  const copyHandler = () => {
    clipboardy.write(title);
  };

  useEffect(() => {
    if (selected) {
      if (keyData.isWithMeta || keyData.isWithCtrl) {
        if (keyData.key.toLowerCase() === 'c') {
          copyHandler();
        }
      }
    }
  }, [keyData]);

  const iconSize = item_height - 20;

  const iconStyle = useMemo(() => {
    return {
      width: iconSize,
      height: iconSize,
      marginRight: icon_right_margin,
      position: 'absolute'
    };
  }, [icon_right_margin]);

  let iconElem;
  if (icon) {
    iconElem = <IconImg style={iconStyle} src={icon} />;
  } else if (valid === false) {
    iconElem = <BiErrorAlt style={iconStyle} />;
  } else {
    iconElem = <BsApp style={iconStyle} />;
  }

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
      <InnerContainer
        style={{
          paddingLeft: iconSize + icon_right_margin
        }}
      >
        <Title
          style={{
            fontSize: title_font_size,
            color: selected ? selected_item_font_color : item_font_color
          }}
        >
          {title}
        </Title>
        <SubTitle
          style={{
            fontSize: subtitle_font_size,
            marginTop: item_title_subtitle_margin,
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
