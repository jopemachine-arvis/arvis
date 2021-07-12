/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable promise/catch-or-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Core } from 'arvis-core';
import fse from 'fs-extra';
import _ from 'lodash';
import { searchMostTotalDownload } from 'arvis-store';
import { StateType } from '@redux/reducers/types';
import { ScreenCover, Spinner } from '@components/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SpinnerContext } from '@helper/spinnerContext';
import { validate as reduxStoreValidate } from '@store/reduxStoreValidator';
import { sleep } from '@utils/index';
import { UIConfigActions } from '@redux/actions';
import { extractGuiConfig } from '@store/extractGuiConfig';
import { arvisReduxStoreResetFlagPath } from '@config/path';
import Sidebar from './Sidebar';
import { PreferencePage } from './preferencePageEnum';
import GeneralPage from './General';
import WorkflowPage from './Workflow';
import AppearancePage from './Appearance';
import PluginPage from './Plugin';
import StorePage from './Store';
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
  const [isSpinning, setSpinning] = useState<boolean>();

  const [initResourced, setInitResourced] = useState<boolean>(false);

  const [fontList, setFontList] = useState<string[]>([]);

  const [allStoreExtensions, setAllStoreExtensions] = useState<any[]>([]);

  const store = useStore();

  const dispatch = useDispatch();

  const { global_font } = useSelector(
    (state: StateType) => state.global_config
  );

  const loadWorkflowsInfo = useCallback(() => {
    return Core.reloadWorkflows().catch((err) => {
      ipcRenderer.send(IPCRendererEnum.showNotification, {
        title: err.name,
        body: err.message,
      });
      console.error(err);
    });
  }, []);

  const loadPluginsInfo = useCallback(() => {
    return Core.reloadPlugins({
      initializePluginWorkspace: false,
    }).catch((err) => {
      ipcRenderer.send(IPCRendererEnum.showNotification, {
        title: err.name,
        body: err.message,
      });
      console.error(err);
    });
  }, []);

  const resetReduxStore = ({
    resetOnlyInvalid,
  }: {
    resetOnlyInvalid: boolean;
  }) => {
    fse
      .writeJson(
        arvisReduxStoreResetFlagPath,
        resetOnlyInvalid ? extractGuiConfig(store.getState()) : {}
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
    reloadWorkflow: (
      e: IpcRendererEvent,
      { bundleId }: { bundleId: string }
    ) => {
      Core.reloadWorkflows(bundleId).catch(console.error);
    },

    reloadPlugin: (e: IpcRendererEvent, { bundleId }: { bundleId: string }) => {
      Core.reloadPlugins({
        initializePluginWorkspace: false,
        bundleId,
      }).catch(console.error);
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
      const userUIConfig = store.getState().ui_config;
      const arvisUIConfig: any = {};

      for (const key of Object.keys(userUIConfig)) {
        arvisUIConfig[`arvis_ui_${key}`] = userUIConfig[key];
      }

      Core.setExternalEnvs({ ...arvisUIConfig, ...JSON.parse(externalEnvs) });
    },

    resetReduxStoreCallback: (e: IpcRendererEvent) => {
      resetReduxStore({ resetOnlyInvalid: false });
    },
  };

  const checkExtensionsUpdate = async () => {
    try {
      const result = await Promise.all([
        Core.checkUpdatableExtensions('workflow'),
        Core.checkUpdatableExtensions('plugin'),
      ]);
      await sleep(100);
      const updatable: any[] = _.flatten(result);

      const updatableTexts = _.map(
        updatable,
        (item) => `${item.name}: ${item.current} → ${item.latest}.`
      ).join('\n');

      if (updatable.length > 0) {
        ipcRenderer.send(IPCRendererEnum.showNotification, {
          title:
            updatable.length === 1
              ? `${updatable.length} extension is updatable`
              : `${updatable.length} extensions are updatable`,
          body: updatableTexts,
        });
      }
      return null;
    } catch (message) {
      return console.error(message);
    }
  };

  const preventInvalidReduxState = () => {
    // Prevent invalid states occurring from updates
    if (!reduxStoreValidate(extractGuiConfig(store.getState()))) {
      resetReduxStore({ resetOnlyInvalid: true });
    }
  };

  const fetchArvisStore = async () => {
    try {
      const extensionInfos = await searchMostTotalDownload();
      setAllStoreExtensions(extensionInfos);
      return extensionInfos;
    } catch (message) {
      return console.error(message);
    }
  };

  const setMacSystemPaths = async () => {
    try {
      const pathEnv = await Core.getSystemPaths();
      Core.setMacPathsEnv(pathEnv);
      return pathEnv;
    } catch (message) {
      return console.error(message);
    }
  };

  useEffect(() => {
    preventInvalidReduxState();
    Core.setStoreAvailabiltyChecker((available) => setSpinning(!available));

    Promise.allSettled([
      loadWorkflowsInfo(),
      loadPluginsInfo(),
      checkExtensionsUpdate(),
      fetchArvisStore(),
      setMacSystemPaths(),
    ])
      .then(() => {
        console.log('resource initialzed successfully.');
        return null;
      })
      .catch(console.error)
      .finally(() => {
        setInitResourced(true);
      });

    ipcRenderer.send(IPCRendererEnum.getSystemFont);
    ipcRenderer.send(IPCRendererEnum.getElectronEnvs, {
      sourceWindow: 'preferenceWindow',
    });

    ipcRenderer.on(IPCMainEnum.getSystemFontRet, ipcCallbackTbl.setFont);
    ipcRenderer.on(IPCMainEnum.reloadPlugin, ipcCallbackTbl.reloadPlugin);
    ipcRenderer.on(IPCMainEnum.reloadWorkflow, ipcCallbackTbl.reloadWorkflow);
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
      ipcRenderer.off(IPCMainEnum.reloadPlugin, ipcCallbackTbl.reloadPlugin);
      ipcRenderer.off(
        IPCMainEnum.reloadWorkflow,
        ipcCallbackTbl.reloadWorkflow
      );
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
      case PreferencePage.Store:
        main = <StorePage allStoreExtensions={allStoreExtensions} />;
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
      {(!initResourced || isSpinning) && <ScreenCover />}
      {(!initResourced || isSpinning) && <Spinner center />}
      <SpinnerContext.Provider value={[isSpinning, setSpinning]}>
        <Sidebar page={page} setPage={setPage} />
        {renderMain()}
      </SpinnerContext.Provider>
    </OuterContainer>
  );
}
