import { ReactNode } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import s from './ErrorText.module.css';

interface ErrorTextProps {
  children: ReactNode;
}

const ErrorText = ({ children }: ErrorTextProps) => {
  return (
    <div className={s.error__text}>
      <MdErrorOutline />
      {children}
    </div>
  );
};

export default ErrorText;
