import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import GlobalConfigReducer from './globalConfig';
import UIConfigReducer from './uiConfig';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    globalConfig: GlobalConfigReducer,
    uiConfig: UIConfigReducer
  });
}
