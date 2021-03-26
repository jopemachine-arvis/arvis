import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Switch, Route } from 'react-router-dom';
import { Store } from '../reducers/types';
import PreferenceContainer from '../containers/Preference';
import routes from '../constants/routes.json';

type Props = {
  store: Store;
  history: History;
};

const RootRouter = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path={routes.HOME} component={PreferenceContainer} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);

export default hot(RootRouter);
