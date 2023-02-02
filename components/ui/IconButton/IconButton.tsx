import classNames from 'classnames';
import React, { ReactNode } from 'react';
import s from './IconButton.module.css';

interface IconButtonProps {
  children: ReactNode;
  buttonType?: 'normal' | 'action';
  'aria-label': string;
}

const IconButton = ({
  children,
  buttonType = 'normal',
  'aria-label': ariaLabel,
  className,
  ...props
}: IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={classNames(className, s.button, {
        [s['button--normal']]: buttonType === 'normal',
        [s['button--action']]: buttonType === 'action',
      })}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
