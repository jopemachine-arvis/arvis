/* eslint-disable @typescript-eslint/naming-convention */
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
                dispatch,
                destWindows: ['searchWindow'],
              })
            }
          />
          <FormDescription>
            If async plugin continues work after this time,
            <br />
            async plugin will be quited forcibly to avoid slowing down
            performance.
          </FormDescription>
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
