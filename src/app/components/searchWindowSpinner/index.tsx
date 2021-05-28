/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/prefer-stateless-function */
import * as React from 'react';
import './index.global.css';

const Spinner = (props: any) => {
  return (
    <div
      className="search-window-spinner"
      style={{
        zIndex: 100,
        position: 'absolute',
        left: '50%',
        top: '40%',
        ...props.style,
      }}
    ></div>
  );
};

export default Spinner;
