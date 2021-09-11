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
        ...props.style,
      }}
    />
  );
};

export default Spinner;
