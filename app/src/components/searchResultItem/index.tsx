import React, { useEffect, useMemo } from 'react';
import { BsApp } from 'react-icons/bs';
import { BiErrorAlt } from 'react-icons/bi';
import useKey from '../../../use-key-capture/src';
import {
  InnerContainer,
  OuterContainer,
  SubTitle,
  Title,
  IconImg,
  OffsetText
} from './components';

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
  offset: number;
};

const searchResultItem = (props: IProps) => {
  const {
    offset,
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

  const iconStyle: React.CSSProperties = useMemo(() => {
    return {
      width: iconSize,
      height: iconSize,
      marginRight: iconRightMargin
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

  const getOffsetText = () => {
    return process.platform === 'darwin'
      ? `⌘${offset + 1}`
      : `Ctrl ${offset + 1}`;
  };

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
          paddingLeft: iconRightMargin
        }}
      >
        {/* If there is no Title or Subtitle, the other item appears in the center */}
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
          {subtitle !== '(none)' ? subtitle : ' '}
        </SubTitle>
      </InnerContainer>
      <OffsetText
        style={{
          fontSize: titleFontSize,
          color: selected ? selectedItemFontColor : itemFontColor
        }}
      >
        {getOffsetText()}
      </OffsetText>
    </OuterContainer>
  );
};

export default searchResultItem;
