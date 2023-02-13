import React from 'react';

const CaveIcon = ({ ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.42857 11.4286C3.42857 10.2857 5.71429 6.85716 7.973 6.85716C10.2857 6.85716 12.5714 10.2857 12.5714 11.4286H8H3.42857ZM8 3.42859C4.57143 3.42859 0 8.00002 0 11.4286H1.14286C1.14286 8.00002 5.71429 4.57145 8 4.57145C10.2857 4.57145 14.8571 8.00002 14.8571 11.4286H16C16 8.00002 11.4286 3.42859 8 3.42859Z"
      fill="black"
    />
  </svg>
);

export default CaveIcon;
