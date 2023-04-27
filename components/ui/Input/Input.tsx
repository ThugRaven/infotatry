import classNames from 'classnames';
import React from 'react';
import s from './Input.module.css';

const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input type="text" className={classNames(className, s.input)} {...props} />
  );
};

export default Input;
