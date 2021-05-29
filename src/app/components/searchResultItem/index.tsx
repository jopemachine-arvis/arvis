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
  arg?: any;
  autocomplete?: string;
  icon?: string;
  iconRightMargin: number;
  itemBackgroundColor: string;
  itemFontColor: string;
  itemHeight: number;
  itemLeftPadding: number;
  itemTitleSubtitleMargin: number;
  offset: number;
  searchWindowTransparency: number;
  selected: boolean;
  selectedItemBackgroundColor: string;
  selectedItemFontColor: string;
  subtitle: string;
  subtitleFontSize: number;
  text?: any;
  title: string;
  titleFontSize: number;
  valid?: boolean;
  variables?: any;
  onMouseoverHandler: () => void;
  onDoubleClickHandler: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
};

const SearchResultItem = (props: IProps) => {
  const {
    arg,
    autocomplete,
    icon,
    iconRightMargin,
    itemBackgroundColor,
    itemFontColor,
    itemHeight,
    itemLeftPadding,
    itemTitleSubtitleMargin,
    offset,
    searchWindowTransparency,
    selected,
    selectedItemBackgroundColor,
    selectedItemFontColor,
    subtitle,
    subtitleFontSize,
    text,
    title,
    titleFontSize,
    valid,
    variables,
    onMouseoverHandler,
    onDoubleClickHandler,
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
      : `ctl ${offset + 1}`;
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
          : 'transparent',
      }}
      onFocus={() => {}}
      onMouseOver={onMouseoverHandler}
      onDoubleClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onDoubleClickHandler(e);
      }}
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
  arg: undefined,
  autocomplete: undefined,
  icon: undefined,
  text: undefined,
  valid: true,
  variables: undefined,
};

export default React.memo(SearchResultItem);
