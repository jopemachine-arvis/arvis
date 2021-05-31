import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import SearchWindowSpinner from '../searchWindowSpinner';
import { IPCRendererEnum } from '../../ipc/ipcEventEnum';
import { OuterContainer, Input } from './components';
import './index.global.css';

type IProps = {
  alwaysFocus: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getInputProps?: Function;
  itemLeftPadding: number;
  searchbarFontColor: string;
  searchbarFontSize: number;
  searchbarHeight: number;
  spinning?: boolean;
};

const SearchBar = (props: IProps) => {
  const {
    alwaysFocus,
    getInputProps,
    itemLeftPadding,
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

  const preventUpAndDownArrow = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  const preventBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    originalRef && originalRef.current && originalRef.current.focus();
  };

  useEffect(() => {
    if (originalRef && originalRef.current) {
      originalRef.current.focus();
    }
  }, [originalRef]);

  const rightClickHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    ipcRenderer.send(IPCRendererEnum.popupSearchbarItemMenu);
  };

  return (
    <OuterContainer
      style={{
        height: searchbarHeight,
      }}
    >
      {spinning && <SearchWindowSpinner />}
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
        onBlur={alwaysFocus ? preventBlur : () => {}}
      />
    </OuterContainer>
  );
};

SearchBar.defaultProps = {
  getInputProps: undefined,
  spinning: false,
};

export default SearchBar;
