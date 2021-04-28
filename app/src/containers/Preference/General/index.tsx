/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../redux/reducers/types';

import { GlobalConfigActions } from '../../../redux/actions';

import { StyledInput } from '../../../components';

import useKey from '../../../../use-key-capture/src';

const formGroupStyle = {
  marginBottom: 35
};

const labelStyle = {
  color: '#ffffff'
};

const OuterContainer = styled.div`
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #12151a;
  padding-top: 60px;
  padding-left: 15px;
  justify-content: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
`;

export default function General() {
  const { keyData } = useKey();

  const isAutoLaunchAtLogin = useSelector(
    (state: StateType) => state.globalConfig.launch_at_login
  );

  const dispatch = useDispatch();

  const [hotkey, setHotkey] = useState<string>(
    useSelector((state: StateType) => state.globalConfig.hotkey)
  );

  const [maxItemCountToShow, setMaxItemCountToShow] = useState<number>(
    useSelector((state: StateType) => state.globalConfig.max_item_count_to_show)
  );

  const [maxItemCountToSearch, setMaxItemCountToSearch] = useState<number>(
    useSelector(
      (state: StateType) => state.globalConfig.max_item_count_to_search
    )
  );

  const [hotkeyFormFocused, setHotkeyFormFocused] = useState<boolean>(false);

  useEffect(() => {
    if (hotkey !== '') {
      dispatch(GlobalConfigActions.setHotkey(hotkey));
    }
  }, [hotkey]);

  useEffect(() => {
    dispatch(GlobalConfigActions.setMaxItemCountToShow(maxItemCountToShow));
  }, [maxItemCountToShow]);

  useEffect(() => {
    dispatch(GlobalConfigActions.setMaxItemCountToSearch(maxItemCountToSearch));
  }, [maxItemCountToSearch]);

  useEffect(() => {
    if (hotkeyFormFocused) {
      let result = '';
      const modifiers = {
        // On mac, cmd key is handled by meta;
        cmd: keyData.isWithMeta,
        ctrl: keyData.isWithCtrl,
        shift: keyData.isWithShift,
        alt: keyData.isWithAlt
      };

      for (const modifier in modifiers) {
        if (modifiers[modifier]) {
          result += `${modifier}+`;
        }
      }

      const normalKey = keyData.key;
      if (normalKey) {
        if (keyData.isSpace) {
          result += 'space';
        } else {
          result += normalKey;
        }
      } else {
        result = result.substring(0, result.length - 1);
      }

      setHotkey(result);
    }
  }, [keyData]);

  const toggleAutoLaunchAtLogin = () => {
    dispatch(GlobalConfigActions.setLaunchAtLogin(!isAutoLaunchAtLogin));
  };

  return (
    <OuterContainer>
      <Form>
        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={isAutoLaunchAtLogin}
              onChange={() => toggleAutoLaunchAtLogin()}
            />
            Launch at login
          </Label>
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Hotkey</Label>
          <StyledInput
            type="text"
            value={hotkey}
            onFocus={() => setHotkeyFormFocused(true)}
            onBlur={() => setHotkeyFormFocused(false)}
            onChange={(e: any) => e.preventDefault()}
          />
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>
            Max item count to show on search window
          </Label>
          <StyledInput
            type="select"
            value={maxItemCountToShow}
            onChange={(e: any) => {
              setMaxItemCountToShow(Number(e.target.value));
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
          </StyledInput>
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Max item count to search</Label>
          <StyledInput
            type="number"
            value={maxItemCountToSearch}
            onChange={(e: any) => {
              setMaxItemCountToSearch(Number(e.target.value));
            }}
          />
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
