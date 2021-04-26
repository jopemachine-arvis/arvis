/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { StateType } from '../../redux/reducers/types';
import './index.global.css';

import useKey from '../../../use-key-capture/_dist/index';

const clipboardy = require('clipboardy');

const Input = styled.input`
  font-weight: normal;
  height: 100%;
  width: 100%;
  border-width: 0px;
`;

const Container = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

type IProps = {
  setInputStr: Function;
};

const searchBar = (props: IProps) => {
  const { keyData, getTargetProps } = useKey();

  const { ref: inputRef, type, originalRef } = getTargetProps();
  const {
    item_background_color,
    item_font_color,
    item_left_padding,
    searchbar_font_size,
    searchbar_height,
  } = useSelector((state: StateType) => state.uiConfig);

  const preventUpAndDownArrow = (e: any) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  const preventBlur = (e: any) => {
    e.preventDefault();
    originalRef && originalRef.current && originalRef.current.focus();
  };

  const selectAllHandler = () => {
    originalRef.current.select();
  };

  const copyHandler = () => {
    const { selectionStart, selectionEnd } = originalRef.current;
    const oldStr = originalRef.current.value;

    const selectedText = oldStr.substring(
      selectionStart,
      selectionEnd
    );

    clipboardy.write(selectedText);
  };

  const pasteHandler = () => {
    const { selectionStart, selectionEnd } = originalRef.current;
    const oldStr = originalRef.current.value;

    clipboardy.read().then((str: string) => {
      const newText =
        oldStr.substring(0, selectionStart) +
        str +
        oldStr.substring(selectionEnd, oldStr.length);
      props.setInputStr(newText);
      originalRef.current.value = newText;
      originalRef.current.selectionStart = selectionEnd + str.length;
      originalRef.current.selectionEnd = selectionEnd + str.length;
    });
  };

  useEffect(() => {
    if (originalRef && originalRef.current) {
      originalRef.current.focus();
    }
  }, [originalRef]);

  useEffect(() => {
    if (keyData.isWithMeta || keyData.isWithCtrl) {
      if (keyData.key.toLowerCase() === 'c') {
        copyHandler();
      } else if (keyData.key.toLowerCase() === 'v') {
        pasteHandler();
      } else if (keyData.key.toLowerCase() === 'a') {
        selectAllHandler();
      }
    }
  }, [keyData]);

  return (
    <Container
      style={{
        height: searchbar_height
      }}
    >
      <Input
        style={{
          backgroundColor: item_background_color,
          color: item_font_color,
          fontSize: searchbar_font_size,
          paddingLeft: item_left_padding,
          borderRadius: 10
        }}
        ref={inputRef}
        type={type}
        onKeyDown={preventUpAndDownArrow}
        onBlur={preventBlur}
      />
    </Container>
  );
};

export default searchBar;
