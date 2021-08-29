/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { StyledInput, HotkeyRecordForm } from '@components/index';
import { actionTypes as ClipboardHistoryActionTypes } from '@redux/actions/clipboardHistory';
import { actionTypes as GlobalConfigActionTypes } from '@redux/actions/globalConfig';
import { StateType } from '@redux/reducers/types';
import {
  onNumberChangeHandler,
  createGlobalConfigChangeHandler,
} from '@utils/index';
import { OuterContainer, FormDescription } from './components';
import { formGroupStyle, labelStyle } from './style';

export default function ClipboardHistory() {
  const hotkey = useSelector(
    (state: StateType) => state.global_config
  ).clipboard_history_window_hotkey;

  const { max_size, max_show, apply_mouse_hover_event } = useSelector(
    (state: StateType) => state.clipboard_history
  );

  const dispatch = useDispatch();

  const configChangeHandler = (destWindows: string[]) =>
    createGlobalConfigChangeHandler({
      destWindows,
      dispatch,
    });

  const hotkeyChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    configChangeHandler(['searchWindow'])(
      e,
      GlobalConfigActionTypes.SET_CLIPBOARD_HISTORY_WINDOW_HOTKEY
    );
  };

  return (
    <OuterContainer>
      <Form>
        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Clipboard History Hotkey</Label>
          <HotkeyRecordForm
            hotkey={hotkey}
            onHotkeyChange={hotkeyChangeHandler}
          />
          <FormDescription>
            Select the form and type the hotkey
            <br />
            you would like to use to show Clipboard History
          </FormDescription>
        </FormGroup>
        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Maximum log count to store</Label>
          <StyledInput
            type="number"
            min={0}
            max={99999}
            defaultValue={max_size}
            onBlur={(e: React.FormEvent<HTMLInputElement>) =>
              onNumberChangeHandler(e, {
                min: 0,
                max: 99999,
                actionType:
                  ClipboardHistoryActionTypes.SET_MAX_CLIPBOARD_STORE_SIZE,
                dispatch,
                destWindow: 'clipboardHistoryWindow',
              })
            }
          />
          <FormDescription>Maximum number of logs to store</FormDescription>
        </FormGroup>
        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Maximum log count to show</Label>
          <StyledInput
            type="number"
            min={0}
            max={500}
            defaultValue={max_show}
            onBlur={(e: React.FormEvent<HTMLInputElement>) =>
              onNumberChangeHandler(e, {
                min: 0,
                max: 500,
                actionType: ClipboardHistoryActionTypes.SET_MAX_SHOW_SIZE,
                dispatch,
                destWindow: 'clipboardHistoryWindow',
              })
            }
          />
          <FormDescription>
            Maximum number of logs to display in the window
          </FormDescription>
        </FormGroup>
        <FormGroup check style={formGroupStyle}>
          <Label checked style={labelStyle}>
            <Input
              type="checkbox"
              defaultChecked={apply_mouse_hover_event}
              onChange={(e) =>
                configChangeHandler([
                  'clipboardHistoryWindow',
                  'preferenceWindow',
                ])(
                  { currentTarget: { value: !apply_mouse_hover_event } } as any,
                  ClipboardHistoryActionTypes.SET_APPLY_MOUSE_HOVER_EVENT_FLAG
                )
              }
            />
            Apply Mouse Hover Event
          </Label>
          <FormDescription>
            Ignore mouse hovering event when disabled
          </FormDescription>
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}
