/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { isWithCtrlOrCmd } from '@utils/index';
import { StateType } from '@redux/reducers/types';
import { useSelector } from 'react-redux';
import {
  SearchWindowScrollbar,
  SearchBar,
  SearchResultItem,
  SearchResultView,
} from '@components/index';
import useKey from '../../../use-key-capture/src';

const OuterContainer = styled.div`
  align-items: center;
  background-color: #111111cc;
  color: #fff;
  display: flex;
  flex-direction: row;
  flex: 1;
  font-size: 32px;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
  text-align: center;
  width: 100%;
  word-break: break-word;
`;

const SearchContainer = styled.div`
  width: 50%;
  height: 100%;
`;

const InfoContainer = styled.div`
  width: 50%;
  height: 100%;
`;

export default function ClipboardManagerWindow() {
  const { keyData } = useKey();

  const { store } = useSelector((state: StateType) => state.clipboard_manager);

  useEffect(() => {

  }, [keyData]);

  return (
    <OuterContainer>
      <SearchContainer>
        
      </SearchContainer>
      <InfoContainer></InfoContainer>
    </OuterContainer>
  );
}
