import classNames from 'classnames';
import React from 'react';
import s from './Input.module.css';

interface InputProps {}

const Input = ({
  className,
  ...props
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input type="text" className={classNames(className, s.input)} {...props} />
  );
};

export default Input;
