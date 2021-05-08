import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useSelector } from 'react-redux';
import { Core } from 'arvis-core';
import Sidebar from './Sidebar';
import { PreferencePage } from './preferencePageEnum';
import GeneralPage from './General';
import WorkflowPage from './Workflow';
import ThemePage from './Theme';
import PluginPage from './Plugin';
import AdvancedPage from './Advanced';
import { StateType } from '../../redux/reducers/types';
import { ScreenCoverContext } from './screenCoverContext';
import { ScreenCover } from '../../components';

const INITIAL_PAGE = PreferencePage.General;

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

export default function PreferenceWindow() {
  const [page, setPage] = useState<PreferencePage>(INITIAL_PAGE);
  const [mainContent, setMainContent] = useState<JSX.Element>(<></>);
  const screenCoverState = useState<boolean>();

  const { hotkey, global_font } = useSelector(
    (state: StateType) => state.globalConfig
  );

  const registerAllGlobalHotkey = () => {
    const globalShortcutCallbackTable = {
      [hotkey]: 'toggleSearchWindow'
    };

    ipcRenderer.send('set-global-shortcut', {
      callbackTable: globalShortcutCallbackTable
    });
  };

  const renewWorkflows = () => {
    Core.renewWorkflows();
  };

  const ipcCallbackTbl = {
    renewWorkflow: (
      e: IpcRendererEvent,
      { bundleId }: { bundleId: string }
    ) => {
      Core.renewWorkflows(bundleId);
    }
  };

  useEffect(() => {
    renewWorkflows();
    registerAllGlobalHotkey();

    ipcRenderer.on('renew-workflow', ipcCallbackTbl.renewWorkflow);
    return () => {
      ipcRenderer.off('renew-workflow', ipcCallbackTbl.renewWorkflow);
    };
  }, []);

  useEffect(() => {
    let main: JSX.Element;

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
      case PreferencePage.Plugin:
        main = <PluginPage />;
        break;
      default:
        throw new Error(`Error, page is not valid value, page: ${page}`);
    }

    setMainContent(main);
  }, [page]);

  const renderMain = () => {
    return <MainContainer>{mainContent}</MainContainer>;
  };

  return (
    <OuterContainer
      style={{
        fontFamily: global_font
      }}
    >
      {screenCoverState[0] && <ScreenCover />}
      <ScreenCoverContext.Provider value={screenCoverState}>
        <Sidebar page={page} setPage={setPage} />
        {renderMain()}
      </ScreenCoverContext.Provider>
    </OuterContainer>
  );
}
