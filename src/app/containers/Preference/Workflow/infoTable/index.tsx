/* eslint-disable promise/no-nesting */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Form, FormGroup, Label } from 'reactstrap';
import { StyledInput } from '@components/index';
import './index.css';
import * as style from './style';

type IProps = {
  info: WorkflowConfigFile;
};

export default function WorkflowInfoTable(props: IProps) {
  const { info } = props;

  const [extensionCategory, setExtensionCategory] = useState<string>('');
  const [extensionCreator, setExtensionCreator] = useState<string>('');
  const [extensionDescription, setExtensionDescription] = useState<string>('');
  const [extensionName, setExtensionName] = useState<string>('');
  const [extensionVersion, setExtensionVersion] = useState<string>('');
  const [extensionWebsite, setExtensionWebsite] = useState<string>('');

  useEffect(() => {
    if (info) {
      const {
        category = '',
        creator = '',
        description = '',
        name = '',
        version = '',
        webAddress = '',
      } = info;

      setExtensionCategory(category);
      setExtensionCreator(creator);
      setExtensionDescription(description);
      setExtensionName(name);
      setExtensionVersion(version);
      setExtensionWebsite(webAddress);
    }
  }, [info]);

  return (
    <Form style={style.descriptionContainerStyle}>
      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Name</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Name"
          value={extensionName}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Creator</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Creator"
          value={extensionCreator}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Version</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Version"
          value={extensionVersion}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Category</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Category"
          value={extensionCategory}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Description</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Description"
          value={extensionDescription}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Web Site</Label>
        <StyledInput
          disabled
          type="url"
          placeholder="Web Site"
          value={extensionWebsite}
        />
      </FormGroup>
    </Form>
  );
}
