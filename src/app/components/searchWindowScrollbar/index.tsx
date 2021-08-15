/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unused-prop-types */
import React from 'react';

type IProps = {
  footerHeight: number;
  itemHeight: number;
  itemLength: number;
  maxShow: number;
  scrollbarColor: string;
  scrollbarWidth: number;
  searchbarHeight: number;
  startItemIdx: number;
  positionStyle?: any;
};

const SearchWindowScrollbar = (props: IProps) => {
  const {
    footerHeight,
    itemHeight,
    itemLength,
    maxShow,
    scrollbarColor,
    scrollbarWidth,
    searchbarHeight,
    startItemIdx,
    positionStyle,
  } = props;

  if (itemLength <= maxShow) {
    return <></>;
  }

  const searchWindowHeight = maxShow * itemHeight + footerHeight;
  let scrollbarHeight = searchWindowHeight - (itemLength - maxShow) * 13 - 20;

  const minScrollbarHeight = 20;
  if (scrollbarHeight < minScrollbarHeight) {
    scrollbarHeight = minScrollbarHeight;
  }

  const lenStep =
    (searchWindowHeight - scrollbarHeight) / (itemLength - maxShow);

  return (
    <div
      style={{
        ...positionStyle,
        width: scrollbarWidth,
        height: scrollbarHeight,
        top: searchbarHeight + startItemIdx * lenStep,
        backgroundColor: scrollbarColor,
      }}
    />
  );
};

SearchWindowScrollbar.defaultProps = {
  positionStyle: {
    position: 'absolute',
    right: 4,
  },
};

export default SearchWindowScrollbar;
