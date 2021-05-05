/* eslint-disable react/jsx-curly-newline */
import { ipcRenderer } from 'electron';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import StyledInput from '../../../components/styledInput';
import { actionTypes as AdvancedActionTypes } from '../../../redux/actions/advancedConfig';
import { StateType } from '../../../redux/reducers/types';
import { makeActionCreator } from '../../../utils';
import { OuterContainer } from './components';
import { formGroupStyle, labelStyle } from './style';

export default function Advanced() {
  const {
    debugging_action_type,
    debugging_workflow_output,
    debugging_workstack
  } = useSelector((state: StateType) => state.advancedConfig);

  const dispatch = useDispatch();

  const toggleState = (actionType: string, bool: boolean) => {
    dispatch(makeActionCreator(actionType, 'arg')(!bool));

    ipcRenderer.send('dispatch-action', {
      destWindow: 'searchWindow',
      actionType,
      args: bool
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
              checked={debugging_workflow_output}
              onChange={() =>
                toggleState(
                  AdvancedActionTypes.SET_DEBUGGING_WORKFLOW_OUTPUT,
                  debugging_workflow_output
                )
              }
            />
            Debugging workflow output
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

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Workflow script executing timeout</Label>
          <StyledInput type="number" onChange={() => {}} />
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
