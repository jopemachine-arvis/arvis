/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import './index.css';

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
    />
  );
};

export default Spinner;
