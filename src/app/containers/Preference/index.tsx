/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Core } from 'arvis-core';
import fse from 'fs-extra';
import path from 'path';
import { StateType } from '@redux/reducers/types';
import { ScreenCover, Spinner } from '@components/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { StoreAvailabilityContext } from '@helper/storeAvailabilityContext';
import { validate as reduxStoreValidate } from '@helper/reduxStoreValidator';
import { sleep } from '@utils/index';
import _ from 'lodash';
import { UIConfigActions } from '@redux/actions';
import Sidebar from './Sidebar';
import { PreferencePage } from './preferencePageEnum';
import GeneralPage from './General';
import WorkflowPage from './Workflow';
import AppearancePage from './Appearance';
import PluginPage from './Plugin';
import ClipboardHistoryPage from './ClipboardHistory';
import AdvancedHistoryPage from './Advanced/AdvancedHistory';
import AdvancedDebuggingPage from './Advanced/AdvancedDebugging';
import AdvancedPluginPage from './Advanced/AdvancedPlugin';

import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';

const INITIAL_PAGE = PreferencePage.General;

const OuterContainer = styled.div`
  width: 100%;
  height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
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
  const [storeAvailable, setStoreAvailable] = useState<boolean>();

  const [fontList, setFontList] = useState<string[]>([]);

  const store = useStore();

  const dispatch = useDispatch();

  const { global_font } = useSelector(
    (state: StateType) => state.global_config
  );

  const loadWorkflowsInfo = useCallback(() => {
    return Core.renewWorkflows().catch(console.error);
  }, []);

  const loadPluginsInfo = useCallback(() => {
    return Core.renewPlugins({
      initializePluginWorkspace: false,
    }).catch(console.error);
  }, []);

  const resetReduxStore = ({
    resetOnlyInvalid,
  }: {
    resetOnlyInvalid: boolean;
  }) => {
    fse
      .writeJson(
        path.resolve(Core.path.tempPath, 'arvis-redux-store-reset'),
        resetOnlyInvalid ? store.getState() : {}
      )
      .then(() => {
        ipcRenderer.send(IPCRendererEnum.reloadApplication);
        return null;
      })
      .catch(console.error);
  };

  /**
   * @summary Used to receive dispatched action from different window
   */
  const ipcCallbackTbl = {
    renewWorkflow: (
      e: IpcRendererEvent,
      { bundleId }: { bundleId: string }
    ) => {
      Core.renewWorkflows(bundleId).catch(console.error);
    },

    renewPlugin: (e: IpcRendererEvent, { bundleId }: { bundleId: string }) => {
      Core.renewPlugins({
        initializePluginWorkspace: false,
        bundleId,
      });
    },

    setPreferencePage: (
      e: IpcRendererEvent,
      { pageToOpen }: { pageToOpen: string }
    ) => {
      setPage(pageToOpen as PreferencePage);
    },

    setFont: (e: Electron.IpcRendererEvent, { fonts }: { fonts: string[] }) => {
      setFontList(fonts);
    },

    autoFitSearchWindowSizeRet: (
      e: Electron.IpcRendererEvent,
      { width }: { width: number }
    ) => {
      dispatch(UIConfigActions.setSearchWindowWidth(width));
    },

    getElectronEnvsRet: (
      e: IpcRendererEvent,
      { externalEnvs }: { externalEnvs: string }
    ) => {
      Core.setExternalEnvs(JSON.parse(externalEnvs));
    },

    resetReduxStoreCallback: (e: IpcRendererEvent) => {
      resetReduxStore({ resetOnlyInvalid: false });
    },
  };

  const checkExtensionsUpdate = () => {
    Promise.all([
      Core.checkUpdatableExtensions('workflow'),
      Core.checkUpdatableExtensions('plugin'),
    ])
      .then(async (result) => {
        await sleep(100);
        const updatable: any[] = _.flatten(result);

        const updatableTexts = _.map(
          updatable,
          (item) => `${item.name}: ${item.current} → ${item.latest}.`
        ).join('\n');

        if (updatable.length > 0) {
          ipcRenderer.send(IPCRendererEnum.showNotification, {
            title: `${updatable.length} extension is updatable`,
            body: updatableTexts,
          });
        }
        return null;
      })
      .catch(console.error);
  };

  const preventInvalidReduxState = () => {
    // Prevent invalid states occurring from updates
    if (!reduxStoreValidate(store.getState())) {
      resetReduxStore({ resetOnlyInvalid: true });
    }
  };

  useEffect(() => {
    preventInvalidReduxState();

    Core.setStoreAvailabiltyChecker(setStoreAvailable);
    loadWorkflowsInfo();
    loadPluginsInfo();
    checkExtensionsUpdate();

    Core.getSystemPaths()
      .then((result) => {
        Core.setMacPathsEnv(result);
        return null;
      })
      .catch(console.error);

    ipcRenderer.send(IPCRendererEnum.getSystemFont);
    ipcRenderer.send(IPCRendererEnum.getElectronEnvs, {
      sourceWindow: 'preferenceWindow',
    });

    ipcRenderer.on(IPCMainEnum.getSystemFontRet, ipcCallbackTbl.setFont);
    ipcRenderer.on(IPCMainEnum.renewPlugin, ipcCallbackTbl.renewPlugin);
    ipcRenderer.on(IPCMainEnum.renewWorkflow, ipcCallbackTbl.renewWorkflow);
    ipcRenderer.on(
      IPCMainEnum.resetReduxStore,
      ipcCallbackTbl.resetReduxStoreCallback
    );
    ipcRenderer.on(
      IPCMainEnum.autoFitSearchWindowSizeRet,
      ipcCallbackTbl.autoFitSearchWindowSizeRet
    );
    ipcRenderer.on(
      IPCMainEnum.getElectronEnvsRet,
      ipcCallbackTbl.getElectronEnvsRet
    );
    ipcRenderer.on(
      IPCMainEnum.setPreferencePage,
      ipcCallbackTbl.setPreferencePage
    );

    return () => {
      ipcRenderer.off(IPCMainEnum.getSystemFontRet, ipcCallbackTbl.setFont);
      ipcRenderer.off(IPCMainEnum.renewPlugin, ipcCallbackTbl.renewPlugin);
      ipcRenderer.off(IPCMainEnum.renewWorkflow, ipcCallbackTbl.renewWorkflow);
      ipcRenderer.off(
        IPCMainEnum.resetReduxStore,
        ipcCallbackTbl.resetReduxStoreCallback
      );
      ipcRenderer.off(
        IPCMainEnum.getElectronEnvsRet,
        ipcCallbackTbl.getElectronEnvsRet
      );
      ipcRenderer.off(
        IPCMainEnum.autoFitSearchWindowSizeRet,
        ipcCallbackTbl.autoFitSearchWindowSizeRet
      );
      ipcRenderer.off(
        IPCMainEnum.setPreferencePage,
        ipcCallbackTbl.setPreferencePage
      );
    };
  }, []);

  useEffect(() => {
    let main: JSX.Element;

    switch (page) {
      case PreferencePage.General:
        main = <GeneralPage fontList={fontList} />;
        break;
      case PreferencePage.Workflow:
        main = <WorkflowPage />;
        break;
      case PreferencePage.AdvancedHistory:
        main = <AdvancedHistoryPage />;
        break;
      case PreferencePage.AdvancedDebugging:
        main = <AdvancedDebuggingPage />;
        break;
      case PreferencePage.AdvancedPlugin:
        main = <AdvancedPluginPage />;
        break;
      case PreferencePage.Appearance:
        main = <AppearancePage />;
        break;
      case PreferencePage.Plugin:
        main = <PluginPage />;
        break;
      case PreferencePage.ClipboardHistory:
        main = <ClipboardHistoryPage />;
        break;
      default:
        throw new Error(`Error, page is not valid value, page: ${page}`);
    }

    setMainContent(main);
  }, [page, fontList]);

  const renderMain = () => {
    return <MainContainer>{mainContent}</MainContainer>;
  };

  return (
    <OuterContainer
      style={{
        fontFamily: global_font,
      }}
    >
      {!storeAvailable && <ScreenCover />}
      {!storeAvailable && <Spinner center />}
      <StoreAvailabilityContext.Provider
        value={[storeAvailable, setStoreAvailable]}
      >
        <Sidebar page={page} setPage={setPage} />
        {renderMain()}
      </StoreAvailabilityContext.Provider>
    </OuterContainer>
  );
}
