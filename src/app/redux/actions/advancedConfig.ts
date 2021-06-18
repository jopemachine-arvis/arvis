import makeActionCreator from '../../utils/makeActionCreator';

export const actionTypes = {
  SET_DEBUGGING_ACTION_TYPE: '@advancedConfig/SET_DEBUGGING_ACTION_TYPE',
  SET_DEBUGGING_ARGS: '@advancedConfig/SET_DEBUGGING_ARGS',
  SET_DEBUGGING_PLUGIN: '@advancedConfig/SET_DEBUGGING_PLUGIN',
  SET_DEBUGGING_SCRIPTFILTER: '@advancedConfig/SET_DEBUGGING_SCRIPTFILTER',
  SET_DEBUGGING_SCRIPT_OUTPUT: '@advancedConfig/SET_DEBUGGING_SCRIPT_OUTPUT',
  SET_DEBUGGING_WORKSTACK: '@advancedConfig/SET_DEBUGGING_WORKSTACK',
  SET_INSTALL_ALFRED_WORKFLOW: '@advancedConfig/SET_INSTALL_ALFRED_WORKFLOW',
  SET_MAX_ACTION_LOG_COUNT: '@advancedConfig/SET_MAX_ACTION_LOG_COUNT',
  SET_ASYNC_PLUGIN_TIMER: '@advancedConfig/SET_ASYNC_PLUGIN_TIMER',
};

export const setMaxActionLogCount = makeActionCreator(
  actionTypes.SET_MAX_ACTION_LOG_COUNT,
  'arg'
);

export const setAlfredWorkflowDirectly = makeActionCreator(
  actionTypes.SET_INSTALL_ALFRED_WORKFLOW,
  'arg'
);

export const setDebuggingPlugin = makeActionCreator(
  actionTypes.SET_DEBUGGING_PLUGIN,
  'arg'
);

export const setDebuggingActionType = makeActionCreator(
  actionTypes.SET_DEBUGGING_ACTION_TYPE,
  'arg'
);

export const setDebuggingScriptOutput = makeActionCreator(
  actionTypes.SET_DEBUGGING_SCRIPT_OUTPUT,
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

export const setAsyncPluginTimer = makeActionCreator(
  actionTypes.SET_ASYNC_PLUGIN_TIMER,
  'arg'
);
