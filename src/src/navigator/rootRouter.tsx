import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Switch, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { functions as loggerFunctions } from 'electron-log';
import { Store } from '../redux/reducers/types';
import {
  Preference as PreferenceContainer,
  Search as SearchContainer,
  Quicklook as QuicklookContainer,
} from '../containers';

Object.assign(console, loggerFunctions);

type IProps = {
  store: Store;
  persistor: any;
  history: History;
  windowName: string;
};

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
    case 'quicklookWindow':
      return <QuicklookContainer />;
    default:
      throw new Error(`windowName is not proper: ${windowName}`);
  }
};

const RootRouter = ({ store, persistor, history, windowName }: IProps) => {
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
