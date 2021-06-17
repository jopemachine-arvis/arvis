/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { BiErrorAlt } from 'react-icons/bi';
import { applyAlphaColor } from '@utils/index';
import DefaultImg from '../../../../assets/images/default.svg';
import {
  InnerContainer,
  OuterContainer,
  SubTitle,
  Title,
  IconImg,
  OffsetText,
} from './components';

type IProps = {
  arg?: any;
  autocomplete?: string;
  extensionDefaultIcon?: string | undefined;
  icon?: string | undefined;
  iconRightMargin: number;
  itemBackgroundColor: string;
  itemFontColor: string;
  itemHeight: number;
  itemLeftPadding: number;
  itemTitleSubtitleMargin: number;
  noShowIcon?: boolean;
  offset: number;
  searchWindowTransparency: number;
  searchWindowWidth: number;
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
    extensionDefaultIcon,
    icon,
    iconRightMargin,
    itemBackgroundColor,
    itemFontColor,
    itemHeight,
    itemLeftPadding,
    itemTitleSubtitleMargin,
    noShowIcon,
    offset,
    searchWindowTransparency,
    searchWindowWidth,
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

  const iconRef = useRef<any>();

  const iconStyle: React.CSSProperties = useMemo(() => {
    return {
      width: iconSize,
      height: iconSize,
      marginRight: iconRightMargin,
      objectFit: 'scale-down',
    };
  }, [iconRightMargin]);

  const getIconElement = useCallback(() => {
    let iconElem;
    if (valid === false) {
      iconElem = <BiErrorAlt style={iconStyle} />;
      return iconElem;
    }

    return (
      <IconImg
        ref={iconRef}
        style={iconStyle}
        src={icon ?? DefaultImg}
        onError={(e) => {
          e.currentTarget.src = extensionDefaultIcon ?? DefaultImg;
        }}
      />
    );
  }, [valid, icon]);

  const getOffsetText = useCallback(() => {
    return process.platform === 'darwin'
      ? `⌘${offset + 1}`
      : `Ctl + ${offset + 1}`;
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
      {!noShowIcon && getIconElement()}
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
      {/* Small screen does not display OffsetText. */}
      {searchWindowWidth >= 850 && offset <= 8 && (
        <OffsetText
          style={{
            color: selected ? selectedItemFontColor : itemFontColor,
          }}
        >
          {getOffsetText()}
        </OffsetText>
      )}
    </OuterContainer>
  );
};

SearchResultItem.defaultProps = {
  arg: undefined,
  autocomplete: undefined,
  extensionDefaultIcon: undefined,
  icon: undefined,
  noShowIcon: false,
  text: undefined,
  valid: true,
  variables: undefined,
};

export default React.memo(SearchResultItem);
