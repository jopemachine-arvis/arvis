import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../redux/reducers/types';

import { GlobalConfigActions } from '../../../redux/actions';

export default function General() {
  const isAutoLaunchAtLogin = useSelector(
    (state: StateType) => state.globalConfig.launch_at_login
  );

  const dispatch = useDispatch();

  const [hotkey, setHotkey] = useState<string>(
    useSelector((state: StateType) => state.globalConfig.hotkey)
  );

  const toggleAutoLaunchAtLogin = () => {
    dispatch(GlobalConfigActions.setLaunchAtLogin(!isAutoLaunchAtLogin));
  };

  useEffect(() => {
    dispatch(GlobalConfigActions.setHotkey(hotkey));
  }, [hotkey]);

  return (
    <OuterContainer>
      <Form>
        <FormGroup check style={{ marginBottom: 35 }}>
          <Label check>
            <Input
              type="checkbox"
              checked={isAutoLaunchAtLogin}
              onClick={() => toggleAutoLaunchAtLogin()}
            />
            Launch at login
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>Hotkey</Label>
          <Input
            type="text"
            value={hotkey}
            onChange={e => {
              setHotkey(e.target.value);
            }}
          />
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}

const OuterContainer = styled.div`
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #16181b;
  padding-top: 15px;
  padding-left: 15px;
  justify-content: center;
`;
