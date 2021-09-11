import React from 'react';
import _ from 'lodash';
import { JsonEditor } from 'jsoneditor-react';

type IProps = {
  value: any;
  variableTblChangeCallback: (e: any) => void;
  setVariableTblRef: any;
};

export default function ExtensionUserVariableTable(props: IProps) {
  const { value, variableTblChangeCallback, setVariableTblRef } = props;

  const variableTblChangeHandler = (e: any) => {
    if (!e.target || !e.target.classList) return;

    if (
      !e.target.classList.contains('jsoneditor-field') &&
      !e.target.classList.contains('jsoneditor-value') &&
      !e.target.classList.contains('jsoneditor-remove')
    )
      return;

    variableTblChangeCallback(e);
  };

  return (
    <JsonEditor
      ref={setVariableTblRef}
      statusBar={false}
      sortObjectKeys={false}
      navigationBar={false}
      history={false}
      search={false}
      onError={console.error}
      value={value}
      onBlur={variableTblChangeHandler}
      htmlElementProps={{
        onBlur: variableTblChangeHandler,
      }}
    />
  );
}
