import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { PreferencePage } from './preferencePageEnum';
import GeneralPage from './General';
import WorkflowPage from './Workflow';
import ThemePage from './Theme';
import AdvancedPage from './Advanced';

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

const INITIAL_PAGE = PreferencePage.General;

export default function PreferenceWindow() {
  const [page, setPage] = useState(INITIAL_PAGE);

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
      console.error('Error, page is not valid value, page: ', page);
      break;
  }

  return (
    <OuterContainer>
      <Sidebar page={page} setPage={setPage} />
      <MainContainer>{main}</MainContainer>
    </OuterContainer>
  );
}