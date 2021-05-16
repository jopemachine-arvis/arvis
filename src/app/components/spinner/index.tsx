// https://projects.lukehaas.me/css-loaders/

import React from 'react';

import './index.global.css';

type IProps = {
  style?: any;
  center?: boolean;
};

export default function Spinner(props: IProps) {
  let { style } = props;
  const { center } = props;

  if (center) {
    style = {
      ...style,
      position: 'absolute',
      margin: 'auto',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      textAlign: 'center',
      zIndex: 100,
    };
  }

  return (
    <div style={style} className="loader">
      Loading...
    </div>
  );
}

Spinner.defaultProps = {
  style: undefined,
  center: false,
};
