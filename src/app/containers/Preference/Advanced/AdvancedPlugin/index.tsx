import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Label } from 'reactstrap';
import StyledInput from '@components/styledInput';
import { actionTypes as AdvancedActionTypes } from '@redux/actions/advancedConfig';
import { StateType } from '@redux/reducers/types';
import { onNumberChangeHandler } from '@utils/index';
import { FormDescription, OuterContainer } from './components';
import { formGroupStyle, labelStyle } from './style';

export default function AdvancedHistory() {
  const { async_plugin_timer } = useSelector(
    (state: StateType) => state.advanced_config
  );

  const dispatch = useDispatch();

  return (
    <OuterContainer>
      <Form>
        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Async plugin timer</Label>
          <StyledInput
            type="number"
            min={1}
            max={999999}
            defaultValue={async_plugin_timer}
            onBlur={(e: React.FormEvent<HTMLInputElement>) =>
              onNumberChangeHandler(e, {
                min: 1,
                max: 999999,
                actionType: AdvancedActionTypes.SET_ASYNC_PLUGIN_TIMER,
              })
            }
          />
          <FormDescription>
            If async plugin continues work after this specified time, the async
            plugins will be defered.
            <br />
            For details, please check{' '}
            <a
              target="_blank"
              href="https://jopemachine.github.io/arvis-docs/documents/extension/plugin-intro/"
              rel="noreferrer"
            >
              Arvis documentation
            </a>
          </FormDescription>
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
