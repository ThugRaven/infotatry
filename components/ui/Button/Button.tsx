import classNames from 'classnames';
import React from 'react';
import s from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
}

const Button = ({
  children,
  variant = 'solid',
  className,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={classNames(className, s.button, {
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
