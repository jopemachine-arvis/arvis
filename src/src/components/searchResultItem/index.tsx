/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo } from 'react';
import { BsApp } from 'react-icons/bs';
import { BiErrorAlt } from 'react-icons/bi';
import {
  InnerContainer,
  OuterContainer,
  SubTitle,
  Title,
  IconImg,
  OffsetText,
} from './components';
import { applyAlphaColor } from '../../utils';

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
  onMouseoverHandler: () => void;
  onDoubleClickHandler: () => void;
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
  searchWindowTransparency: number;
};

const SearchResultItem = (props: IProps) => {
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
    titleFontSize,
    searchWindowTransparency,
  } = props;

  const iconSize = useMemo(() => itemHeight - 20, [itemHeight]);

  const iconStyle: React.CSSProperties = useMemo(() => {
    return {
      width: iconSize,
      height: iconSize,
      marginRight: iconRightMargin,
    };
  }, [iconRightMargin]);

  const getIconElement = useCallback(() => {
    let iconElem;
    if (valid === false) {
      iconElem = <BiErrorAlt style={iconStyle} />;
      return iconElem;
    }

    if (icon) {
      iconElem = <IconImg style={iconStyle} src={icon} />;
    } else {
      iconElem = <BsApp style={iconStyle} />;
    }
    return iconElem;
  }, [valid, icon]);

  const getOffsetText = useCallback(() => {
    return process.platform === 'darwin'
      ? `⌘${offset + 1}`
      : `Ctrl ${offset + 1}`;
  }, []);

  return (
    <OuterContainer
      style={{
        height: itemHeight,
        paddingLeft: itemLeftPadding,
        backgroundColor: selected
          ? applyAlphaColor(
              selectedItemBackgroundColor,
              searchWindowTransparency
            )
          : applyAlphaColor(itemBackgroundColor, searchWindowTransparency),
      }}
      onFocus={() => {}}
      onMouseOver={() => onMouseoverHandler()}
      onDoubleClick={() => onDoubleClickHandler()}
    >
      {getIconElement()}
      <InnerContainer
        style={{
          paddingLeft: iconRightMargin,
        }}
      >
        {/* If there is no Title or Subtitle, the other item appears in the center */}
        <Title
          style={{
            fontSize: titleFontSize,
            color: selected ? selectedItemFontColor : itemFontColor,
          }}
        >
          {title}
        </Title>
        <SubTitle
          style={{
            fontSize: subtitleFontSize,
            marginTop: itemTitleSubtitleMargin,
            color: selected ? selectedItemFontColor : itemFontColor,
          }}
        >
          {subtitle !== '(none)' ? subtitle : ' '}
        </SubTitle>
      </InnerContainer>
      <OffsetText
        style={{
          fontSize: titleFontSize,
          color: selected ? selectedItemFontColor : itemFontColor,
        }}
      >
        {getOffsetText()}
      </OffsetText>
    </OuterContainer>
  );
};

SearchResultItem.defaultProps = {
  icon: undefined,
  arg: undefined,
  text: undefined,
  autocomplete: undefined,
  variables: undefined,
  valid: true,
};

export default React.memo(SearchResultItem);
