import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Switch, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { functions as loggerFunctions, transports } from 'electron-log';
import { Core } from '@jopemachine/arvis-core';
import { LogType } from '@jopemachine/arvis-core/dist/config/logger';
import { Store } from '../redux/reducers/types';
import {
  Preference as PreferenceContainer,
  Search as SearchContainer,
  Quicklook as QuicklookContainer,
  LargeText as LargeTextContainer,
} from '../containers';

Object.assign(console, loggerFunctions);

type IProps = {
  store: Store;
  persistor: any;
  history: History;
  windowName: string;
};

/**
 * @param  {string} windowName
 */
const windowRoute = (windowName: string) => {
  switch (windowName) {
    case 'preferenceWindow':
      return (
        <Switch>
          <Route path="/" component={PreferenceContainer} />
        </Switch>
      );
    case 'searchWindow':
      return <SearchContainer />;
    case 'largeTextWindow':
      return <LargeTextContainer />;
    case 'quicklookWindow':
      return <QuicklookContainer />;
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
 * @param  {Store} store
 * @param  {any} persistor
 * @param  {History} history
 * @param  {string} windowName
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
