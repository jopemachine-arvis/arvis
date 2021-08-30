/* eslint-disable @typescript-eslint/naming-convention */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Label } from 'reactstrap';
import { HotkeyRecordForm } from '@components/index';
import { actionTypes as GlobalConfigActionTypes } from '@redux/actions/globalConfig';
import { StateType } from '@redux/reducers/types';
import { createGlobalConfigChangeHandler } from '@utils/index';
import useSnippet from '@hooks/useSnippet';
import { OuterContainer, FormDescription } from './components';
import { formGroupStyle, labelStyle } from './style';
import SnippetTable from './snippetTable';

export default function Snippet() {
  const hotkey = useSelector(
    (state: StateType) => state.global_config
  ).universal_action_window_hotkey;

  const dispatch = useDispatch();

  const { snippets, reloadSnippets } = useSnippet();

  const configChangeHandler = (destWindows: string[]) =>
    createGlobalConfigChangeHandler({
      destWindows,
      dispatch,
    });

  const hotkeyChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    configChangeHandler(['searchWindow'])(
      e,
      GlobalConfigActionTypes.SET_UNIVERSAL_ACTION_WINDOW_HOTKEY
    );
  };

  return (
    <OuterContainer>
      <Form>
        <FormGroup style={formGroupStyle}>
          <Label style={labelStyle}>Snippet Hotkey</Label>
          <HotkeyRecordForm
            hotkey={hotkey}
            onHotkeyChange={hotkeyChangeHandler}
          />
          <FormDescription>
            Select the form and type the hotkey
            <br />
            you would like to use to show Snippet Window
          </FormDescription>
        </FormGroup>
      </Form>
      <SnippetTable snippets={snippets} reloadSnippets={reloadSnippets} />
    </OuterContainer>
  );
}
