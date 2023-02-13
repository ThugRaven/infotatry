import React from 'react';

const ShelterIcon = ({ ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.8667 2.1333L1.06668 6.39997V8.5333L2.13335 8.1781V13.8666H12.8V11.7333H4.26668V7.46663L13.8667 4.26663V2.1333Z"
      fill="black"
    />
  </svg>
);

export default ShelterIcon;
