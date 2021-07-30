import { AdvancedConfigActions } from '@redux/actions';
import { StateType } from './types';

const { actionTypes: AdvancedConfigActionTypes } = AdvancedConfigActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case AdvancedConfigActionTypes.SET_DEBUGGING_ACTION:
      return {
        ...state,
        debugging_action: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_VARIABLES:
      return {
        ...state,
        debugging_variables: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_SCRIPT:
      return {
        ...state,
        debugging_script: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_TRIGGER_STACK:
      return {
        ...state,
        debugging_trigger_stack: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_SCRIPTFILTER:
      return {
        ...state,
        debugging_scriptfilter: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_PLUGIN:
      return {
        ...state,
        debugging_plugin: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_MAX_ACTION_LOG_COUNT:
      return {
        ...state,
        max_action_log_count: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_ASYNC_PLUGIN_TIMER:
      return {
        ...state,
        async_plugin_timer: payload.arg,
      };
    default:
      return state;
  }
};

export function getAsyncPluginTimer(state: StateType) {
  return state.advanced_config.async_plugin_timer;
}

export function getMaxActionLogCount(state: StateType) {
  return state.advanced_config.max_action_log_count;
}

export function getIsOnDebuggingAction(state: StateType) {
  return state.advanced_config.debugging_action;
}

export function getIsOnDebuggingScript(state: StateType) {
  return state.advanced_config.debugging_script;
}

export function getIsOnDebuggingTriggerStack(state: StateType) {
  return state.advanced_config.debugging_trigger_stack;
}

export function getIsOnDebuggingPlugin(state: StateType) {
  return state.advanced_config.debugging_plugin;
}

export function getIsOnDebuggingScriptfilter(state: StateType) {
  return state.advanced_config.debugging_scriptfilter;
}
