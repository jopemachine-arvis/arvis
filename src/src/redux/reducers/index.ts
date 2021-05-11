import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import GlobalConfigReducer from './globalConfig';
import UIConfigReducer from './uiConfig';
import AdvancedConfigReducer from './advancedConfig';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    global_config: GlobalConfigReducer,
    advanced_config: AdvancedConfigReducer,
    ui_config: UIConfigReducer,
  });
}
