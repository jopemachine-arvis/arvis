import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { PersistGate } from 'redux-persist/integration/react';
import { functions as loggerFunctions, transports } from 'electron-log';
import { Core } from 'arvis-core';
import { LogType } from 'arvis-core/dist/config/logger';
import { Store } from '../redux/reducers/types';
import {
  Preference as PreferenceContainer,
  Search as SearchContainer,
  LargeText as LargeTextContainer,
  ClipboardHistory as ClipboardHistoryContainer,
} from '../containers';

Object.assign(console, loggerFunctions);

type IProps = {
  store: Store;
  persistor: any;
  history: History;
  windowName: string;
};

/**
 * @param windowName
 */
const windowRoute = (windowName: string) => {
  switch (windowName) {
    case 'preferenceWindow':
      return <PreferenceContainer />;
    case 'searchWindow':
      return <SearchContainer />;
    case 'largeTextWindow':
      return <LargeTextContainer />;
    case 'clipboardHistoryWindow':
      return <ClipboardHistoryContainer />;
    default:
      throw new Error(`windowName is not proper: '${windowName}'`);
  }
};

/**
 * @summary
 */
const handleLoggerSetting = () => {
  if (process.env.NODE_ENV === 'development') {
    transports.file.level = 'debug';
    Core.logger.setLogLevels([LogType.debug, LogType.info, LogType.error]);
  } else {
    transports.file.level = 'info';
    Core.logger.setLogLevels([LogType.info, LogType.error]);
  }
};

/**
 * @param {Store} store
 * @param persistor
 * @param {History<State>} history
 * @param windowName
 */
const RootRouter = ({ store, persistor, history, windowName }: IProps) => {
  handleLoggerSetting();

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={history}>
          {windowRoute(windowName)}
        </ConnectedRouter>
      </PersistGate>
    </ReduxProvider>
  );
};

export default hot(RootRouter);
