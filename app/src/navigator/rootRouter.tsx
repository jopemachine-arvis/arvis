/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/order */
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Switch, Route } from 'react-router-dom';
import { Store } from '../redux/reducers/types';
import {
  Preference as PreferenceContainer,
  Search as SearchContainer
} from '../containers';
import { PersistGate } from 'redux-persist/integration/react';

import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';

type Props = {
  store: Store;
  persistor: any;
  history: History;
  windowName: string;
};

const RootRouter = ({ store, persistor, history, windowName }: Props) => {
  let windowComp;
  if (windowName === 'preferenceWindow') {
    windowComp = (
      <Switch>
        <Route path="/" component={PreferenceContainer} />
      </Switch>
    );
  } else {
    windowComp = <SearchContainer />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={history}>{windowComp}</ConnectedRouter>
      </PersistGate>
    </Provider>
  );
};

export default hot(RootRouter);
