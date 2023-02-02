import React from 'react';

const NodeIcon = ({ ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="9.5" fill="#FAFAFA" stroke="black" />
  </svg>
);

export default NodeIcon;
