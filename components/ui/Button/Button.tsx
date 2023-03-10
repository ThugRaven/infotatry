import classNames from 'classnames';
import React from 'react';
import s from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  responsive?: boolean;
  variant?: 'solid' | 'outline';
}

const Button = ({
  children,
  responsive = false,
  variant = 'solid',
  className,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={classNames(className, s.button, {
        [s['button--responsive']]: responsive,
        [s['button--solid']]: variant === 'solid',
        [s['button--outline']]: variant === 'outline',
      })}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
