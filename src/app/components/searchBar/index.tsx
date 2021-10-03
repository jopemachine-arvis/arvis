/* eslint-disable @typescript-eslint/ban-types */

import { ipcRenderer } from 'electron';
import React, { useCallback, useEffect } from 'react';
import SearchWindowSpinner from '../searchWindowSpinner';
import { IPCRendererEnum } from '../../ipc/ipcEventEnum';
import { OuterContainer, Input, AutoSuggestion } from './components';
import SearchbarDragger from './dragger';
import './index.css';

type IProps = {
  alwaysFocus: boolean;
  autoSuggestion?: string;
  hasDragger?: boolean;
  draggerColor?: string;
  getInputProps?: Function;
  hasContextMenu?: boolean;
  isPinned?: boolean;
  itemLeftPadding: number;
  searchbarAutomatchFontColor: string;
  searchbarFontColor: string;
  searchbarFontSize: number;
  searchbarHeight: number;
  spinning?: boolean;
};

const SearchBar = (props: IProps) => {
  const {
    alwaysFocus,
    autoSuggestion,
    draggerColor,
    getInputProps,
    hasContextMenu,
    hasDragger,
    isPinned,
    itemLeftPadding,
    searchbarAutomatchFontColor,
    searchbarFontColor,
    searchbarFontSize,
    searchbarHeight,
    spinning,
  } = props;

  const {
    ref: inputRef,
    type,
    originalRef,
  } = getInputProps
    ? getInputProps()
    : {
        ref: null,
        originalRef: null,
        type: '',
      };

  useEffect(() => {
    if (originalRef && originalRef.current) {
      originalRef.current.focus();
    }
  }, [originalRef]);

  const preventUpAndDownArrow = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
      // For quicklook feature, prevent adding space when quicklook shortcut is pressed
      if (e.key === ' ' && e.shiftKey) {
        e.preventDefault();
      }
    },
    []
  );

  const preventBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    originalRef && originalRef.current && originalRef.current.focus();
  };

  const rightClickHandler = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      if (hasContextMenu) {
        e.preventDefault();
        ipcRenderer.send(IPCRendererEnum.popupSearchbarItemMenu, { isPinned });
      }
    },
    [hasContextMenu, isPinned]
  );

  return (
    <OuterContainer
      style={{
        height: searchbarHeight,
      }}
    >
      {spinning && (
        <SearchWindowSpinner style={{ left: undefined, right: '55px' }} />
      )}
      <Input
        id="searchBar"
        className="searchBar"
        style={{
          backgroundColor: 'transparent',
          color: searchbarFontColor,
          fontSize: searchbarFontSize,
          outline: 'none',
          paddingLeft: itemLeftPadding,
        }}
        ref={inputRef}
        type={type}
        onKeyDown={preventUpAndDownArrow}
        onContextMenu={rightClickHandler}
        onBlur={alwaysFocus ? preventBlur : undefined}
      />
      {autoSuggestion && (
        <AutoSuggestion
          style={{
            left: itemLeftPadding,
            fontSize: searchbarFontSize,
            color: searchbarAutomatchFontColor,
          }}
        >
          {autoSuggestion}
        </AutoSuggestion>
      )}
      {hasDragger && <SearchbarDragger color={draggerColor} />}
    </OuterContainer>
  );
};

SearchBar.defaultProps = {
  autoSuggestion: '',
  draggerColor: '#fff',
  getInputProps: undefined,
  hasContextMenu: true,
  hasDragger: false,
  isPinned: false,
  spinning: false,
};

export default SearchBar;
