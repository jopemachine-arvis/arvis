import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, FormGroup, Label, Input } from 'reactstrap';

export default function General() {
  return (
    <OuterContainer>
      <Form>
        <FormGroup check style={{ marginBottom: 35 }}>
          <Label check>
            <Input type="checkbox" />
            Launch at login
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>Hotkey</Label>
          <Input type="text" value="abc" />
        </FormGroup>
      </Form>
    </OuterContainer>
  );
}

const OuterContainer = styled.div`
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #16181b;
  padding-top: 15px;
  padding-left: 15px;
  justify-content: center;
`;