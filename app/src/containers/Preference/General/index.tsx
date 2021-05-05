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

export default function General() {
  const { keyData } = useKey();

  const {
    launch_at_login: isAutoLaunchAtLogin,
    global_font: globalFont
  } = useSelector((state: StateType) => state.globalConfig);

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

  const [fontList, setFontList] = useState<string[]>([]);

  const [fontListDrawerOpen, setFontListDrawerOpen] = useState(false);

  const toggleFontListDrawerOpen = () =>
    setFontListDrawerOpen(prevState => !prevState);

  const fontSelectEventHandler = (font: string) => {
    dispatch(GlobalConfigActions.setGlobalFont(font));
  };

  useEffect(() => {
    ipcRenderer.send('get-system-fonts');
    ipcRenderer.on('get-system-fonts-ret', (e, { fonts }) => {
      setFontList(fonts);
    });
  }, []);

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
      } else {
        // remove last ' + '
        result = result.substring(0, result.length - 3);
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
            style={{
              textTransform: 'capitalize',
              color: 'transparent',
              textShadow: '0px 0px 0px #fff'
            }}
            type="text"
            value={hotkey}
            onFocus={() => setHotkeyFormFocused(true)}
            onBlur={() => setHotkeyFormFocused(false)}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              e.preventDefault()
            }
          />
        </FormGroup>

        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>
            Max item count to show on search window
          </Label>
          <StyledInput
            type="select"
            value={maxItemCountToShow}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setMaxItemCountToShow(Number(e.currentTarget.value));
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
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setMaxItemCountToSearch(Number(e.currentTarget.value));
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
              {globalFont}
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
