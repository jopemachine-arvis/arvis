import React from 'react';
import { Input as ReactStrapInput } from 'reactstrap';
import './index.global.css';

const StyledInput = (props: any) => {
  const { style, className } = props;

  return (
    <ReactStrapInput
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={`styledInput ${className}`}
      style={{
        backgroundColor: '#1f2228',
        borderColor: '#2f323c',
        color: '#ffffff',
        textAlign: 'center',
        ...style,
      }}
    />
  );
};

export default StyledInput;
