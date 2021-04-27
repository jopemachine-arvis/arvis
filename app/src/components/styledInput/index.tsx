/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Input as ReactStrapInput } from 'reactstrap';
import './index.global.css';

const StyledInput = (props: any) => {
  return (
    <ReactStrapInput
      className={'styledInput'}
      style={{
        backgroundColor: '#1f2228',
        borderColor: '#2f323c',
        color: '#ffffff',
        textAlign: 'center'
      }}
      {...props}
    />
  );
};

export default StyledInput;
