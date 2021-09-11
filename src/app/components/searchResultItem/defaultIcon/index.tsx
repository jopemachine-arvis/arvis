/* eslint-disable react/display-name */

import React from 'react';

type IProps = {
  styleProp?: any;
  color?: string;
};

export default (props: IProps) => {
  const { color, styleProp } = props;

  return (
    <svg
      style={styleProp}
      className="bi bi-app"
      width="128"
      height="128"
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M11 2H5a3 3 0 00-3 3v6a3 3 0 003 3h6a3 3 0 003-3V5a3 3 0 00-3-3zM5 1a4 4 0 00-4 4v6a4 4 0 004 4h6a4 4 0 004-4V5a4 4 0 00-4-4H5z"
        clipRule="evenodd"
      />
    </svg>
  );
};
