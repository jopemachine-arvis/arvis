import React, { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

import {
  OuterContainer,
  WorkflowDescContainer,
  Header,
  PreviewContainer
} from './components';

const formGroupStyle = {
  marginBottom: 15,
  width: '75%',
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const labelStyle = {
  fontSize: 13,
  color: '#ffffff',
  width: 400,
  marginRight: 15
};

const descriptionContainerStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#666666',
  paddingTop: 10,
  paddingBottom: 10,
  borderRadius: 10,
  marginLeft: 20,
  marginRight: 20
};

export default function Theme() {
  return (
    <OuterContainer>
      <PreviewContainer>
        <Header>Preview</Header>
      </PreviewContainer>
      <WorkflowDescContainer>
        <Header>Theme config</Header>
        <Form style={descriptionContainerStyle}>
          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Width</Label>
            <Input type="number" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Height</Label>
            <Input type="number" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item Height</Label>
            <Input type="number" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item background color</Label>
            <Input type="color" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Selected item background color</Label>
            <Input type="color" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item font size</Label>
            <Input type="number" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Selected item font size</Label>
            <Input type="number" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item left padding</Label>
            <Input type="number" />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item top padding</Label>
            <Input type="number" />
          </FormGroup>
        </Form>
      </WorkflowDescContainer>
    </OuterContainer>
  );
}
