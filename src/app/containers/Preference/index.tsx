/* eslint-disable import/no-webpack-loader-syntax */
import React, { useCallback, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Core } from 'arvis-core';
import fse from 'fs-extra';
import _ from 'lodash';
import { searchMostTotalDownload } from 'arvis-store';
import { StateType } from '@redux/reducers/types';
import {
  ScreenCover,
  Spinner,
  WalkThroughModal,
  ChangeLogModal,
} from '@components/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import { SpinnerContext } from '@helper/spinnerContext';
import { checkExtensionsUpdate } from '@helper/extensionUpdateChecker';
import { validate as reduxStoreValidate } from '@store/reduxStoreValidator';
import { makeDefaultActionCreator } from '@utils/index';
import { UIConfigActions } from '@redux/actions';
import { extractGuiConfig } from '@store/extractGuiConfig';
import { arvisReduxStoreResetFlagPath } from '@config/path';
import { useSnippet } from '@hooks/index';
import ioHook from 'iohook';
import Sidebar from './Sidebar';
import { PreferencePage } from './preferencePageEnum';
import GeneralPage from './General';
import WorkflowPage from './Workflow';
import AppearancePage from './Appearance';
import PluginPage from './Plugin';
import StorePage from './Store';
import ClipboardHistoryPage from './ClipboardHistory';
import UniversalActionPage from './UniversalAction';
import SnippetPage from './Snippet';
import AdvancedHistoryPage from './Advanced/AdvancedHistory';
import AdvancedDebuggingPage from './Advanced/AdvancedDebugging';
import AdvancedPluginPage from './Advanced/AdvancedPlugin';
import { MainContainer, OuterContainer } from './components';
import './index.css';

import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';

const INITIAL_PAGE = PreferencePage.General;

export default function PreferenceWindow() {
  const [page, setPage] = useState<PreferencePage>(INITIAL_PAGE);
  const [mainContent, setMainContent] = useState<JSX.Element>(<></>);
  const [isSpinning, setSpinning] = useState<boolean>();

  const [initResourced, setInitResourced] = useState<boolean>(false);

  const { snippets, snippetCollectionInfos, reloadSnippets } = useSnippet();

  const [fontList, setFontList] = useState<string[]>([]);

  const [allStoreExtensions, setAllStoreExtensions] = useState<any[]>([]);

  const [walkThroughModalOpened, setWalkThroughModalOpened] =
    useState<boolean>(false);

  const [changeLogModalOpened, setChangeLogModalOpened] =
    useState<boolean>(false);

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
   * Used to receive dispatched action from different window
   */
  const ipcCallbackTbl = {
    fetchAction: (
      e: IpcRendererEvent,
      { actionType, args }: { actionType: string; args: any }
    ) => {
      dispatch(makeDefaultActionCreator(actionType)(args));
    },

    reloadWorkflow: (
      e: IpcRendererEvent,
      { bundleIds }: { bundleIds: string }
    ) => {
      const targets = bundleIds ? JSON.parse(bundleIds) : undefined;

      Core.reloadWorkflows(targets).catch(console.error);
    },

    reloadPlugin: (
      e: IpcRendererEvent,
      { bundleIds }: { bundleIds: string }
    ) => {
      const targets = bundleIds ? JSON.parse(bundleIds) : undefined;

      Core.reloadPlugins({
        initializePluginWorkspace: false,
        bundleIds: targets,
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

    autoFitSearchWindowSize: (
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

    openWalkThroughModalbox: (e: IpcRendererEvent) => {
      setWalkThroughModalOpened(true);
    },

    openChangeLogModalbox: (e: IpcRendererEvent) => {
      setChangeLogModalOpened(true);
    },
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

  const setShellPaths = async () => {
    try {
      const pathEnv = await Core.getShellPaths();
      Core.setShellPathEnv(pathEnv);
      return pathEnv;
    } catch (message) {
      return console.error(message);
    }
  };

  useEffect(() => {
    return () => {
      ioHook.removeAllListeners();
      ioHook.unload();
    };
  }, []);

  useEffect(() => {
    preventInvalidReduxState();
    Core.setStoreAvailabiltyChecker((available) => setSpinning(!available));

    Promise.allSettled([
      loadWorkflowsInfo(),
      loadPluginsInfo(),
      checkExtensionsUpdate(),
      fetchArvisStore(),
      setShellPaths(),
    ])
      .then(() => {
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
  }, []);

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
    ipcRenderer.on(IPCMainEnum.getSystemFontRet, ipcCallbackTbl.setFont);
    ipcRenderer.on(IPCMainEnum.reloadPlugin, ipcCallbackTbl.reloadPlugin);
    ipcRenderer.on(IPCMainEnum.reloadWorkflow, ipcCallbackTbl.reloadWorkflow);
    ipcRenderer.on(
      IPCMainEnum.resetReduxStore,
      ipcCallbackTbl.resetReduxStoreCallback
    );
    ipcRenderer.on(
      IPCMainEnum.autoFitSearchWindowSize,
      ipcCallbackTbl.autoFitSearchWindowSize
    );
    ipcRenderer.on(
      IPCMainEnum.getElectronEnvsRet,
      ipcCallbackTbl.getElectronEnvsRet
    );
    ipcRenderer.on(
      IPCMainEnum.setPreferencePage,
      ipcCallbackTbl.setPreferencePage
    );
    ipcRenderer.on(
      IPCMainEnum.openWalkThroughModalbox,
      ipcCallbackTbl.openWalkThroughModalbox
    );
    ipcRenderer.on(
      IPCMainEnum.openChangeLogModalbox,
      ipcCallbackTbl.openChangeLogModalbox
    );

    return () => {
      ipcRenderer.off(IPCMainEnum.fetchAction, ipcCallbackTbl.fetchAction);
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
        IPCMainEnum.autoFitSearchWindowSize,
        ipcCallbackTbl.autoFitSearchWindowSize
      );
      ipcRenderer.off(
        IPCMainEnum.setPreferencePage,
        ipcCallbackTbl.setPreferencePage
      );
      ipcRenderer.off(
        IPCMainEnum.openWalkThroughModalbox,
        ipcCallbackTbl.openWalkThroughModalbox
      );
      ipcRenderer.off(
        IPCMainEnum.openChangeLogModalbox,
        ipcCallbackTbl.openChangeLogModalbox
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
      case PreferencePage.UniversalAction:
        main = <UniversalActionPage />;
        break;
      case PreferencePage.Snippet:
        main = (
          <SnippetPage
            snippets={snippets}
            snippetCollectionInfos={snippetCollectionInfos}
            reloadSnippets={reloadSnippets}
          />
        );
        break;
      default:
        throw new Error(`Error, page is not valid value, page: ${page}`);
    }

    setMainContent(main);
  }, [page, fontList, snippets]);

  const renderMain = () => {
    return <MainContainer>{mainContent}</MainContainer>;
  };

  return (
    <OuterContainer
      id="preferenceOuterContainer"
      style={{
        fontFamily: global_font,
      }}
    >
      {(!initResourced || isSpinning) && <ScreenCover />}
      {(!initResourced || isSpinning) && <Spinner center />}
      <SpinnerContext.Provider value={[isSpinning, setSpinning]}>
        <Sidebar page={page} setPage={setPage} />
        {renderMain()}
        <WalkThroughModal
          opened={walkThroughModalOpened}
          setOpened={setWalkThroughModalOpened}
        />
        <ChangeLogModal
          opened={changeLogModalOpened}
          setOpened={setChangeLogModalOpened}
        />
      </SpinnerContext.Provider>
    </OuterContainer>
  );
}
