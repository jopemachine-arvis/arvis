/* eslint-disable @typescript-eslint/ban-types */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import createRootReducer from '@redux/reducers';
import { StateType } from '@redux/reducers/types';
import { electronPersistedStore } from '@store/electronStorage';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (
      obj: Record<string, any>
    ) => Function;
  }
  interface NodeModule {
    hot?: {
      accept: (path: string, cb: () => void) => void;
    };
  }
}

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const persistConfig = {
  key: 'root',
  storage: electronPersistedStore,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = (initialState?: StateType) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });

  // Redux logging only enabled in development
  if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators,
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(persistedReducer, initialState, enhancer);

  // Create Persistor
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept(
      '../redux/reducers',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('../redux/reducers').default)
    );
  }

  return {
    store,
    persistor,
  };
};

export default { configureStore, history };
