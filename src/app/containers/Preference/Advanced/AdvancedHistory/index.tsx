/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Label } from 'reactstrap';
import StyledInput from '@components/styledInput';
import { actionTypes as AdvancedActionTypes } from '@redux/actions/advancedConfig';
import { StateType } from '@redux/reducers/types';
import { onNumberChangeHandler } from '@utils/index';
import { Core } from 'arvis-core';
import { FormDescription, OuterContainer } from './components';
import { formGroupStyle, labelStyle } from './style';

export default function AdvancedHistory() {
  const { max_action_log_count } = useSelector(
    (state: StateType) => state.advanced_config
  );

  useEffect(() => {
    Core.history.setMaxLogCnt(max_action_log_count);
  }, [max_action_log_count]);

  const dispatch = useDispatch();

  return (
    <OuterContainer>
      <Form>
        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Max action log count to save</Label>
          <StyledInput
            type="number"
            min={0}
            max={99999}
            defaultValue={max_action_log_count}
            onBlur={(e: React.FormEvent<HTMLInputElement>) =>
              onNumberChangeHandler(e, {
                min: 0,
                max: 99999,
                actionType: AdvancedActionTypes.SET_MAX_ACTION_LOG_COUNT,
                dispatch,
                destWindows: ['searchWindow'],
              })
            }
          />
          <FormDescription>
            Arvis store action execution log, input log.
            <br />
            Set this logs max count to store.
          </FormDescription>
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
