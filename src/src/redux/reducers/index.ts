import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import GlobalConfigReducer from './globalConfig';
import UIConfigReducer from './uiConfig';
import AdvancedConfigReducer from './advancedConfig';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    globalConfig: GlobalConfigReducer,
    advancedConfig: AdvancedConfigReducer,
    uiConfig: UIConfigReducer,
  });
}
