/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import StyledInput from '../../../components/styledInput';
import { AdvancedConfigActions } from '../../../redux/actions';
import { StateType } from '../../../redux/reducers/types';
import { OuterContainer } from './components';
import { formGroupStyle, labelStyle } from './style';

export default function Advanced() {
  const {
    debugging_action_type,
    debugging_workflow_output,
    debugging_workstack
  } = useSelector((state: StateType) => state.advancedConfig);

  const dispatch = useDispatch();

  const toggleState = (action: Function, bool: boolean) => {
    dispatch(action(!bool));
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
                  AdvancedConfigActions.setDebuggingActionType,
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
                  AdvancedConfigActions.setDebuggingWorkflowOutput,
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
                  AdvancedConfigActions.setDebuggingWorkstack,
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
