import { AdvancedConfigActions } from '../actions';
import { StateType } from './types';

const { actionTypes: AdvancedConfigActionTypes } = AdvancedConfigActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case AdvancedConfigActionTypes.SET_INSTALL_ALFRED_WORKFLOW:
      return {
        ...state,
        can_install_alfredworkflow: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_ACTION_TYPE:
      return {
        ...state,
        debugging_action_type: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_WORKFLOW_OUTPUT:
      return {
        ...state,
        debugging_workflow_output: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_WORKSTACK:
      return {
        ...state,
        debugging_workstack: payload.arg,
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_ARGS:
      return {
        ...state,
        debugging_args: payload.arg,
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
    default:
      return state;
  }
};

export function getMaxActionLogCount(state: StateType) {
  return state.advanced_config.max_action_log_count;
}

export function getCanAlfredWorkflowFileInstall(state: StateType) {
  return state.advanced_config.can_install_alfredworkflow;
}

export function getIsOnDebuggingActionType(state: StateType) {
  return state.advanced_config.debugging_action_type;
}

export function getIsOnDebuggingWorkflowOutput(state: StateType) {
  return state.advanced_config.debugging_workflow_output;
}

export function getIsOnDebuggingWorkflowStack(state: StateType) {
  return state.advanced_config.debugging_workstack;
}

export function getIsOnDebuggingArgs(state: StateType) {
  return state.advanced_config.debugging_args;
}

export function getIsOnDebuggingPlugin(state: StateType) {
  return state.advanced_config.debugging_plugin;
}

export function getIsOnDebuggingScriptfilter(state: StateType) {
  return state.advanced_config.debugging_scriptfilter;
}
