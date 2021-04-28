import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { BsApp } from 'react-icons/bs';
import { BiErrorAlt } from 'react-icons/bi';

import useKey from '../../use-key-capture/src';

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

  itemBackgroundColor: string;
  itemFontColor: string;
  itemHeight: number;
  itemLeftPadding: number;
  itemTitleSubtitleMargin: number;
  iconRightMargin: number;
  selectedItemBackgroundColor: string;
  selectedItemFontColor: string;
  subtitleFontSize: number;
  titleFontSize: number;
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
    valid,
    iconRightMargin,
    itemBackgroundColor,
    itemFontColor,
    itemHeight,
    itemLeftPadding,
    itemTitleSubtitleMargin,
    selectedItemBackgroundColor,
    selectedItemFontColor,
    subtitleFontSize,
    titleFontSize
  } = props;

  const { keyData } = useKey();

  const copyHandler = () => {
    clipboardy.write(title);
  };

  useEffect(() => {
    // if (selected) {
    //   if (keyData.isWithMeta || keyData.isWithCtrl) {
    //     if (keyData.key.toLowerCase() === 'c') {
    //       copyHandler();
    //     }
    //   }
    // }
  }, [keyData]);

  const iconSize = itemHeight - 20;

  const iconStyle = useMemo(() => {
    return {
      width: iconSize,
      height: iconSize,
      marginRight: iconRightMargin,
      position: 'absolute'
    };
  }, [iconRightMargin]);

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
        height: itemHeight,
        paddingLeft: itemLeftPadding,
        backgroundColor: selected
          ? selectedItemBackgroundColor
          : itemBackgroundColor
      }}
      onFocus={() => {}}
      onMouseOver={() => onMouseoverHandler()}
      onDoubleClick={() => onDoubleClickHandler()}
    >
      {iconElem}
      <InnerContainer
        style={{
          paddingLeft: iconSize + iconRightMargin
        }}
      >
        <Title
          style={{
            fontSize: titleFontSize,
            color: selected ? selectedItemFontColor : itemFontColor
          }}
        >
          {title}
        </Title>
        <SubTitle
          style={{
            fontSize: subtitleFontSize,
            marginTop: itemTitleSubtitleMargin,
            color: selected ? selectedItemFontColor : itemFontColor
          }}
        >
          {subtitle}
        </SubTitle>
      </InnerContainer>
    </OuterContainer>
  );
};

export default searchResultItem;
