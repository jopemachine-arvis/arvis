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

import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';

type Props = {
  store: Store;
  history: History;
  windowName: string;
};

const RootRouter = ({ store, history, windowName }: Props) => {
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
      <ConnectedRouter history={history}>{windowComp}</ConnectedRouter>
    </Provider>
  );
};

export default hot(RootRouter);
