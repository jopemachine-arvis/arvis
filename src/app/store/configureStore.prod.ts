import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { persistReducer, persistStore } from 'redux-persist';
import createRootReducer from '../redux/reducers';
import { StateType } from '../redux/reducers/types';
import { electronPersistedStore } from './electronStorage';

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const persistConfig = {
  key: 'root',
  storage: electronPersistedStore,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

function configureStore(initialState?: StateType): any {
  const store = createStore(persistedReducer, initialState, enhancer);
  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
}

export default { configureStore, history };
