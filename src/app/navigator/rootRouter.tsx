import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { PersistGate } from 'redux-persist/integration/react';
import { functions as loggerFunctions, transports } from 'electron-log';
import { Core } from 'arvis-core';
import { LogType } from 'arvis-core/dist/config/logger';
import { logger as CustomLogger } from '../config/logger';
import { Store } from '../redux/reducers/types';
import {
  Preference as PreferenceContainer,
  Search as SearchContainer,
  LargeText as LargeTextContainer,
  AssistanceWindow as AssistanceWindowContainer,
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
    case 'assistanceWindow':
      return <AssistanceWindowContainer />;
    default:
      throw new Error(`windowName is not proper: '${windowName}'`);
  }
};

/**
 * @summary
 */
const handleLoggerSetting = () => {
  Core.logger.injectCustomConsole(CustomLogger);

  if (process.env.NODE_ENV === 'development') {
    transports.file.level = 'debug';
    Core.logger.setLogLevels([LogType.debug, LogType.info, LogType.error]);
  } else {
    transports.file.level = 'info';
    Core.logger.setLogLevels([LogType.info, LogType.error]);
  }
};

/**
 * @param store
 * @param persistor
 * @param history
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
