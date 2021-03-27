import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Switch, Route } from 'react-router-dom';
import { Store } from '../reducers/types';
import PreferenceContainer from '../containers/Preference';

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
    
  }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{windowComp}</ConnectedRouter>
    </Provider>
  );
};

export default hot(RootRouter);
