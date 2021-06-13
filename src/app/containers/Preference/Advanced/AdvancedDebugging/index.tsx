/* eslint-disable @typescript-eslint/naming-convention */
import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { actionTypes as AdvancedActionTypes } from '@redux/actions/advancedConfig';
import { StateType } from '@redux/reducers/types';
import { makeActionCreator } from '@utils/index';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { Core } from '@jopemachine/arvis-core';
import { OuterContainer } from './components';
import { formGroupStyle, labelStyle } from './style';

export default function AdvancedDebugging() {
  const {
    debugging_action_type,
    debugging_script_output,
    debugging_workstack,
    debugging_args,
    debugging_scriptfilter,
    debugging_plugin,
    max_action_log_count,
  } = useSelector((state: StateType) => state.advanced_config);

  useEffect(() => {
    Core.history.setMaxLogCnt(max_action_log_count);
  }, [max_action_log_count]);

  const dispatch = useDispatch();

  const toggleState = (actionType: string, bool: boolean) => {
    dispatch(makeActionCreator(actionType, 'arg')(!bool));

    ipcRenderer.send(IPCRendererEnum.dispatchAction, {
      destWindow: 'searchWindow',
      actionType,
      args: !bool,
    });
  };

  return (
    <OuterContainer>
      <Form>
        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_action_type}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_ACTION_TYPE,
                  debugging_action_type
                )
              }
            />
            Debugging action types
          </Label>
        </FormGroup>

        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_script_output}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_SCRIPT_OUTPUT,
                  debugging_script_output
                )
              }
            />
            Debugging script output
          </Label>
        </FormGroup>

        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_workstack}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_WORKSTACK,
                  debugging_workstack
                )
              }
            />
            Debugging workstack
          </Label>
        </FormGroup>

        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_scriptfilter}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_SCRIPTFILTER,
                  debugging_scriptfilter
                )
              }
            />
            Debugging scriptfilter
          </Label>
        </FormGroup>

        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_args}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_ARGS,
                  debugging_args
                )
              }
            />
            Debugging arguments, query, variables
          </Label>
        </FormGroup>

        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_plugin}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_PLUGIN,
                  debugging_plugin
                )
              }
            />
            Debugging plugins
          </Label>
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
