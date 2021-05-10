/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/no-array-index-key */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import { StateType } from '../../../redux/reducers/types';
import { GlobalConfigActions } from '../../../redux/actions';
import { OuterContainer } from './components';
import { formGroupStyle, labelStyle } from './style';
import { StyledInput } from '../../../components';
import useKey from '../../../../use-key-capture/src';
import { actionTypes as GlobalConfigActionTypes } from '../../../redux/actions/globalConfig';
import { createGlobalConfigChangeHandler } from '../../../utils';
import { IPCMainEnum, IPCRendererEnum } from '../../../ipc/ipcEventEnum';

export default function General() {
  const { keyData } = useKey();
  const {
    hotkey,
    max_item_count_to_search,
    max_item_count_to_show,
    launch_at_login,
    global_font
  } = useSelector((state: StateType) => state.globalConfig);

  const [hotkeyFormFocused, setHotkeyFormFocused] = useState<boolean>(false);
  const [fontList, setFontList] = useState<string[]>([]);
  const [fontListDrawerOpen, setFontListDrawerOpen] = useState(false);

  const dispatch = useDispatch();

  const toggleFontListDrawerOpen = () =>
    setFontListDrawerOpen(prevState => !prevState);

  const fontSelectEventHandler = (font: string) => {
    dispatch(GlobalConfigActions.setGlobalFont(font));
  };

  const ipcCallbackTbl = {
    setFont: (e: Electron.IpcRendererEvent, { fonts }: { fonts: string[] }) => {
      setFontList(fonts);
    }
  };

  const configChangeHandler = createGlobalConfigChangeHandler({
    destWindow: 'searchWindow',
    dispatch
  });

  useEffect(() => {
    ipcRenderer.send(IPCRendererEnum.getSystemFont);
    ipcRenderer.on(IPCMainEnum.getSystemFontRet, ipcCallbackTbl.setFont);

    return () => {
      ipcRenderer.off(IPCMainEnum.getSystemFontRet, ipcCallbackTbl.setFont);
    };
  }, []);

  useEffect(() => {
    if (hotkeyFormFocused) {
      console.log('Recorded keyData', keyData);

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
          result += `${modifier} + `;
        }
      }

      const normalKey = keyData.key;
      if (normalKey) {
        if (keyData.isSpace) {
          result += 'Space';
        } else {
          result += normalKey;
        }
      }
      // Modifier key without normal key is not allowed
      else if (!normalKey && !keyData.doubleKeyPressed) {
        return;
      }
      // Double modifier key
      else {
        // remove last ' + '
        result = result.substring(0, result.length - 3);
      }

      const doubledStr = keyData.doubleKeyPressed ? 'Double ' : '';

      configChangeHandler(
        {
          currentTarget: {
            value: doubledStr + result
          }
        } as React.FormEvent<HTMLInputElement>,
        GlobalConfigActionTypes.SET_HOT_KEY
      );
    }
  }, [keyData]);

  const toggleAutoLaunchAtLogin = () => {
    dispatch(GlobalConfigActions.setLaunchAtLogin(!launch_at_login));
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
          <Label style={labelStyle}>Hotkey</Label>
          <StyledInput
            style={{
              textTransform: 'capitalize',
              color: 'transparent',
              textShadow: '0px 0px 0px #fff'
            }}
            type="text"
            value={hotkey}
            onFocus={() => setHotkeyFormFocused(true)}
            onBlur={() => setHotkeyFormFocused(false)}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              e.preventDefault();
              configChangeHandler(e, GlobalConfigActionTypes.SET_HOT_KEY);
            }}
          />
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
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Max item count to search</Label>
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
                borderColor: '#2F323B'
              }}
              caret
            >
              {global_font}
            </DropdownToggle>
            <DropdownMenu
              style={{
                overflowY: 'auto',
                maxHeight: 300,
                backgroundColor: '#1F2227'
              }}
            >
              {fontList.map((font: string, idx: number) => {
                return (
                  <DropdownItem
                    key={`font-${idx}`}
                    style={{
                      fontFamily: font,
                      backgroundColor: '#1F2227',
                      color: '#fff'
                    }}
                    onClick={() => fontSelectEventHandler(font)}
                  >
                    {font}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
