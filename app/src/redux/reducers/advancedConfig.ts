import { AdvancedConfigActions } from '../actions';
import { StateType } from './types';

const { actionTypes: AdvancedConfigActionTypes } = AdvancedConfigActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case AdvancedConfigActionTypes.SET_DEBUGGING_ACTION_TYPE:
      return {
        ...state,
        debugging_action_type: payload.bool
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_WORKFLOW_OUTPUT:
      return {
        ...state,
        debugging_workflow_output: payload.bool
      };
    case AdvancedConfigActionTypes.SET_DEBUGGING_WORKSTACK:
      return {
        ...state,
        debugging_workstack: payload.bool
      };
    default:
      return state;
  }
};

export function getIsOnDebuggingActionType(state: StateType) {
  return state.advancedConfig.debugging_action_type;
}

export function getIsOnDebuggingWorkflowOutput(state: StateType) {
  return state.advancedConfig.debugging_workflow_output;
}

export function getIsOnDebuggingWorkflowStack(state: StateType) {
  return state.advancedConfig.debugging_workstack;
}
