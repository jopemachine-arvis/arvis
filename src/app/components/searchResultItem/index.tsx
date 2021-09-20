/* eslint-disable react/display-name */
/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useMemo, useRef } from 'react';
import { BiErrorAlt } from 'react-icons/bi';
import { applyAlphaColor } from '@utils/index';
import QuickLRU from 'quick-lru';
import DefaultImg from './defaultIcon';
import IconNotFoundImg from '../../../../assets/images/iconNotFound.png';
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
  errorIcons?: QuickLRU<string, boolean>;
  extensionDefaultIcon?: string | undefined;
  icon?: string | undefined;
  iconRightMargin: number;
  itemBackgroundColor: string;
  itemDefaultIconColor?: string;
  itemFontColor: string;
  itemHeight: number;
  itemLeftPadding: number;
  itemTitleSubtitleMargin: number;
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
    // * Unused props
    // arg,
    // autocomplete,
    // text,
    // variables,
    // itemBackgroundColor,
    errorIcons,
    extensionDefaultIcon,
    iconRightMargin,
    itemDefaultIconColor,
    itemFontColor,
    itemHeight,
    itemLeftPadding,
    itemTitleSubtitleMargin,
    offset,
    searchWindowTransparency,
    searchWindowWidth,
    selected,
    selectedItemBackgroundColor,
    selectedItemFontColor,
    subtitle,
    subtitleFontSize,
    title,
    titleFontSize,
    valid,
    onMouseoverHandler,
    onDoubleClickHandler,
  } = props;

  let { icon } = props;

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

    if (!icon && !extensionDefaultIcon) {
      return <DefaultImg styleProp={iconStyle} color={itemDefaultIconColor} />;
    }

    if (icon && errorIcons && errorIcons.has(icon)) {
      icon = undefined;
    }

    return (
      <IconImg
        id={`searchResultItemIcon-${offset}`}
        ref={iconRef}
        style={iconStyle}
        src={icon ?? extensionDefaultIcon}
        onError={(e) => {
          try {
            if (icon && errorIcons) {
              console.log(`'${icon}' icon file is not found.`);
              errorIcons.set(icon, false);
            }

            if (extensionDefaultIcon) {
              (
                document.getElementById(
                  `searchResultItemIcon-${offset}`
                )! as HTMLImageElement
              ).src = extensionDefaultIcon;
            } else {
              (
                document.getElementById(
                  `searchResultItemIcon-${offset}`
                )! as HTMLImageElement
              ).src = IconNotFoundImg;
            }
          } catch (err) {
            console.error(err);
          }
        }}
      />
    );
  }, [valid, icon, itemDefaultIconColor]);

  const getOffsetText = useCallback(() => {
    return process.platform === 'darwin'
      ? `⌘${offset + 1}`
      : `Ctl + ${offset + 1}`;
  }, []);

  return (
    <OuterContainer
      className="searchResultItem"
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
      onDoubleClick={onDoubleClickHandler}
    >
      {getIconElement()}
      <InnerContainer
        style={{
          paddingLeft: iconRightMargin,
        }}
      >
        {/* If there is no Title or Subtitle, the other item appears in the center */}
        <Title
          id={`searchResultItemTitle-${offset}`}
          style={{
            fontSize: titleFontSize,
            color: selected ? selectedItemFontColor : itemFontColor,
          }}
        >
          {String(title)}
        </Title>
        <SubTitle
          id={`searchResultItemSubTitle-${offset}`}
          style={{
            fontSize: subtitleFontSize,
            marginTop: itemTitleSubtitleMargin,
            color: selected ? selectedItemFontColor : itemFontColor,
          }}
        >
          {subtitle ? String(subtitle) : ''}
        </SubTitle>
      </InnerContainer>
      {/* Does not display OffsetText in small screen. */}
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
  errorIcons: undefined,
  extensionDefaultIcon: undefined,
  icon: undefined,
  itemDefaultIconColor: '#fff',
  text: undefined,
  valid: true,
  variables: undefined,
};

export default React.memo(SearchResultItem);
