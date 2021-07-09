import makeActionCreator from '@utils/makeActionCreator';

export const actionTypes = {
  SET_ASYNC_PLUGIN_TIMER: '@advancedConfig/SET_ASYNC_PLUGIN_TIMER',
  SET_DEBUGGING_ACTION: '@advancedConfig/SET_DEBUGGING_ACTION',
  SET_DEBUGGING_PLUGIN: '@advancedConfig/SET_DEBUGGING_PLUGIN',
  SET_DEBUGGING_SCRIPT: '@advancedConfig/SET_DEBUGGING_SCRIPT',
  SET_DEBUGGING_SCRIPTFILTER: '@advancedConfig/SET_DEBUGGING_SCRIPTFILTER',
  SET_DEBUGGING_TRIGGER_STACK: '@advancedConfig/SET_DEBUGGING_TRIGGER_STACK',
  SET_INSTALL_ALFRED_WORKFLOW: '@advancedConfig/SET_INSTALL_ALFRED_WORKFLOW',
  SET_MAX_ACTION_LOG_COUNT: '@advancedConfig/SET_MAX_ACTION_LOG_COUNT',
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

export const setDebuggingAction = makeActionCreator(
  actionTypes.SET_DEBUGGING_ACTION,
  'arg'
);

export const setDebuggingScript = makeActionCreator(
  actionTypes.SET_DEBUGGING_SCRIPT,
  'arg'
);

export const setDebuggingTriggerStk = makeActionCreator(
  actionTypes.SET_DEBUGGING_TRIGGER_STACK,
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
