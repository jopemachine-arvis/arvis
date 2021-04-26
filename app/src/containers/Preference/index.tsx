import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { PreferencePage } from './preferencePageEnum';

import GeneralPage from './General';
import WorkflowPage from './Workflow';
import ThemePage from './Theme';
import AdvancedPage from './Advanced';
import { StateType } from '../../redux/reducers/types';

const INITIAL_PAGE = PreferencePage.General;

export default function PreferenceWindow() {
  const [page, setPage] = useState(INITIAL_PAGE);

  const { hotkey } = useSelector((state: StateType) => state.globalConfig);

  useEffect(() => {
    const globalShortcutCallbackTable = {
      [hotkey]: 'showSearchWindow'
    };

    ipcRenderer.send('set-global-shortcut', {
      callbackTable: globalShortcutCallbackTable
    });
  }, []);

  let main;
  switch (page) {
    case PreferencePage.General:
      main = <GeneralPage />;
      break;
    case PreferencePage.Workflow:
      main = <WorkflowPage />;
      break;
    case PreferencePage.Advanced:
      main = <AdvancedPage />;
      break;
    case PreferencePage.Theme:
      main = <ThemePage />;
      break;
    default:
      throw new Error(`Error, page is not valid value, page: ${page}`);
  }

  return (
    <OuterContainer>
      <Sidebar page={page} setPage={setPage} />
      <MainContainer>{main}</MainContainer>
    </OuterContainer>
  );
}

const OuterContainer = styled.div`
  width: 100%;
  height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
`;
