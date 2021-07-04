/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Form, FormGroup, Label } from 'reactstrap';
import { StyledInput } from '@components/index';
import './index.global.css';
import * as style from './style';

type IProps = {
  info: any;
};

export default function WorkflowInfoTable(props: IProps) {
  const { info } = props;

  const [workflowCategory, setWorkflowCategory] = useState<string>('');
  const [workflowCreator, setWorkflowCreator] = useState<string>('');
  const [workflowDescription, setWorkflowDescription] = useState<string>('');
  const [workflowName, setWorkflowName] = useState<string>('');
  const [workflowReadme, setWorkflowReadme] = useState<string>('');
  const [workflowVersion, setWorkflowVersion] = useState<string>('');
  const [workflowWebsite, setWorkflowWebsite] = useState<string>('');

  useEffect(() => {
    if (info) {
      const {
        category = '',
        creator = '',
        description = '',
        name = '',
        readme = '',
        version = '',
        webAddress = '',
      } = info;

      setWorkflowCategory(category);
      setWorkflowCreator(creator);
      setWorkflowDescription(description);
      setWorkflowName(name);
      setWorkflowReadme(readme);
      setWorkflowVersion(version);
      setWorkflowWebsite(webAddress);
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
          value={workflowName}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Creator</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Creator"
          value={workflowCreator}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Version</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Version"
          value={workflowVersion}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Category</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Category"
          value={workflowCategory}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Description</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Description"
          value={workflowDescription}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Read Me</Label>
        <StyledInput
          disabled
          type="textarea"
          className="workflow-page-textarea"
          placeholder="README"
          style={{
            height: 260,
          }}
          value={workflowReadme}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Web Site</Label>
        <StyledInput
          disabled
          type="url"
          placeholder="Web Site"
          value={workflowWebsite}
        />
      </FormGroup>
    </Form>
  );
}
