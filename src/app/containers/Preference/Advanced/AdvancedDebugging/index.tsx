/* eslint-disable @typescript-eslint/naming-convention */
import { ipcRenderer } from 'electron';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { actionTypes as AdvancedActionTypes } from '@redux/actions/advancedConfig';
import { StateType } from '@redux/reducers/types';
import { makeActionCreator } from '@utils/index';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { OuterContainer, FormDescription } from './components';
import { formGroupStyle, labelStyle } from './style';

export default function AdvancedDebugging() {
  const {
    debugging_action,
    debugging_plugin,
    debugging_script,
    debugging_scriptfilter,
    debugging_trigger_stack,
  } = useSelector((state: StateType) => state.advanced_config);

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
              checked={debugging_action}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_ACTION,
                  debugging_action
                )
              }
            />
            Debugging actions
          </Label>
          <FormDescription>
            Print executed action information on devtools
          </FormDescription>
        </FormGroup>

        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_action}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_VARIABLES,
                  debugging_action
                )
              }
            />
            Variables (Arguments, query, variables information)
          </Label>
          <FormDescription>
            Print variable information on devtools
          </FormDescription>
        </FormGroup>

        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_script}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_SCRIPT,
                  debugging_script
                )
              }
            />
            Debugging script
          </Label>
          <FormDescription>
            Print executed script and script&lsquo;s stdout, stderr on devtools
          </FormDescription>
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
          <FormDescription>
            Print executed scriptfilter&lsquo;s script devtools
          </FormDescription>
        </FormGroup>

        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={debugging_trigger_stack}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_TRIGGER_STACK,
                  debugging_trigger_stack
                )
              }
            />
            Debugging trigger stack
          </Label>
          <FormDescription>
            Print executed trigger info on devtools
          </FormDescription>
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
          <FormDescription>
            Print executed plugin info on devtools
          </FormDescription>
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
