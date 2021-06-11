/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import { StateType } from '@redux/reducers/types';
import { GlobalConfigActions } from '@redux/actions';
import { StyledInput, HotkeyRecordForm } from '@components/index';
import { actionTypes as GlobalConfigActionTypes } from '@redux/actions/globalConfig';
import { createGlobalConfigChangeHandler } from '@utils/index';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { OuterContainer, FormDescription } from './components';
import { formGroupStyle, labelStyle } from './style';

type IProps = {
  fontList: any[];
};

export default function General(props: IProps) {
  const { fontList } = props;
  const {
    global_font,
    launch_at_login,
    max_item_count_to_search,
    max_item_count_to_show,
    toggle_search_window_hotkey,
  } = useSelector((state: StateType) => state.global_config);

  const [fontListDrawerOpen, setFontListDrawerOpen] = useState(false);

  const dispatch = useDispatch();

  const toggleFontListDrawerOpen = () =>
    setFontListDrawerOpen((prevState) => !prevState);

  const fontSelectEventHandler = (font: string) => {
    dispatch(GlobalConfigActions.setGlobalFont(font));
  };

  const configChangeHandler = createGlobalConfigChangeHandler({
    destWindow: 'searchWindow',
    dispatch,
  });

  const toggleAutoLaunchAtLogin = () => {
    dispatch(GlobalConfigActions.setLaunchAtLogin(!launch_at_login));

    ipcRenderer.send(IPCRendererEnum.setAutoLaunch, {
      autoLaunch: !launch_at_login,
    });
  };

  const hotkeyChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    configChangeHandler(
      e,
      GlobalConfigActionTypes.SET_TOGGLE_SEARCH_WINDOW_HOTKEY
    );
  };

  return (
    <OuterContainer>
      <Form>
        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              checked={launch_at_login}
              onChange={() => toggleAutoLaunchAtLogin()}
            />
            Launch at login
          </Label>
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Arvis Hotkey</Label>
          <HotkeyRecordForm
            hotkey={toggle_search_window_hotkey}
            onHotkeyChange={hotkeyChangeHandler}
          />
          <FormDescription>
            Select the form and type the hotkey
            <br />
            you would like to use to show Arvis
          </FormDescription>
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>
            Max item count to show on search window
          </Label>
          <StyledInput
            type="select"
            value={max_item_count_to_show}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              configChangeHandler(
                e,
                GlobalConfigActionTypes.SET_MAX_ITEM_COUNT_TO_SHOW
              );
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
          <FormDescription>
            Number of search items result
            <br />
            that can appear on search window
          </FormDescription>
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Max item count to retrieve</Label>
          <StyledInput
            type="number"
            value={max_item_count_to_search}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              configChangeHandler(
                e,
                GlobalConfigActionTypes.SET_MAX_ITEM_COUNT_TO_SEARCH
              );
            }}
          />
          <FormDescription>
            Limits the number of search results
            <br />
            in workflows, plugins
          </FormDescription>
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Fonts</Label>
          <Dropdown
            isOpen={fontListDrawerOpen}
            toggle={toggleFontListDrawerOpen}
          >
            <DropdownToggle
              style={{
                width: '100%',
                backgroundColor: '#1F2227',
                borderColor: '#2F323B',
              }}
              caret
            >
              {global_font}
            </DropdownToggle>
            <DropdownMenu
              style={{
                overflowY: 'auto',
                maxHeight: 300,
                backgroundColor: '#1F2227',
              }}
            >
              {fontList.map((font: string, idx: number) => {
                return (
                  <DropdownItem
                    key={`font-${idx}`}
                    style={{
                      fontFamily: font,
                      backgroundColor: '#1F2227',
                      color: '#fff',
                    }}
                    onClick={() => fontSelectEventHandler(font)}
                  >
                    {font}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
          <FormDescription>Available fonts</FormDescription>
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
