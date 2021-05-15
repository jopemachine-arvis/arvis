import makeActionCreator from '../../utils/makeActionCreator';

export const actionTypes = {
  SET_DEBUGGING_ACTION_TYPE: '@advancedConfig/SET_DEBUGGING_ACTION_TYPE',
  SET_DEBUGGING_WORKSTACK: '@advancedConfig/SET_DEBUGGING_WORKSTACK',
  SET_DEBUGGING_ARGS: '@advancedConfig/SET_DEBUGGING_ARGS',
  SET_DEBUGGING_SCRIPTFILTER: '@advancedConfig/SET_DEBUGGING_SCRIPTFILTER',
  SET_INSTALL_ALFRED_WORKFLOW: '@advancedConfig/SET_INSTALL_ALFRED_WORKFLOW',
  SET_DEBUGGING_WORKFLOW_OUTPUT:
    '@advancedConfig/SET_DEBUGGING_WORKFLOW_OUTPUT',
};

export const setAlfredWorkflowDirectly = makeActionCreator(
  actionTypes.SET_INSTALL_ALFRED_WORKFLOW,
  'arg'
);

export const setDebuggingActionType = makeActionCreator(
  actionTypes.SET_DEBUGGING_ACTION_TYPE,
  'arg'
);

export const setDebuggingWorkflowOutput = makeActionCreator(
  actionTypes.SET_DEBUGGING_WORKFLOW_OUTPUT,
  'arg'
);

export const setDebuggingWorkstack = makeActionCreator(
  actionTypes.SET_DEBUGGING_WORKSTACK,
  'arg'
);

export const setDebuggingArgs = makeActionCreator(
  actionTypes.SET_DEBUGGING_ARGS,
  'arg'
);

export const setDebuggingScriptFilter = makeActionCreator(
  actionTypes.SET_DEBUGGING_SCRIPTFILTER,
  'arg'
);