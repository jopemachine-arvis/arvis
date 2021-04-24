import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../redux/reducers/types';

import { GlobalConfigActions } from '../../../redux/actions';

const formGroupStyle = {
  marginBottom: 35
};

export default function General() {
  const isAutoLaunchAtLogin = useSelector(
    (state: StateType) => state.globalConfig.launch_at_login
  );

  const dispatch = useDispatch();

  const [hotkey, setHotkey] = useState<string>(
    useSelector((state: StateType) => state.globalConfig.hotkey)
  );

  const [maxItemCount, setMaxItemCount] = useState<number>(
    useSelector((state: StateType) => state.globalConfig.max_item_count)
  );

  const toggleAutoLaunchAtLogin = () => {
    dispatch(GlobalConfigActions.setLaunchAtLogin(!isAutoLaunchAtLogin));
  };

  useEffect(() => {
    dispatch(GlobalConfigActions.setHotkey(hotkey));
  }, [hotkey]);

  useEffect(() => {
    dispatch(GlobalConfigActions.setMaxItemCount(maxItemCount));
  }, [maxItemCount]);

  return (
    <OuterContainer>
      <Form>
        <FormGroup check style={formGroupStyle}>
          <Label checked>
            <Input
              type="checkbox"
              checked={isAutoLaunchAtLogin}
              onChange={() => toggleAutoLaunchAtLogin()}
            />
            Launch at login
          </Label>
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label>Hotkey</Label>
          <Input
            type="text"
            value={hotkey}
            onChange={e => {
              setHotkey(e.target.value);
            }}
          />
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label>Max item count</Label>
          <Input
            type="select"
            name="select"
            value={maxItemCount}
            onChange={e => {
              setMaxItemCount(Number(e.target.value));
            }}
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
          </Input>
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
