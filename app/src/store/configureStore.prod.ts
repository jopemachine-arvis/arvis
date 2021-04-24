import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../redux/reducers';
import { Store, StateType } from '../redux/reducers/types';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

function configureStore(initialState?: StateType): Store {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
