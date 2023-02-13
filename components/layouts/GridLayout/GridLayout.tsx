import { ReactNode } from 'react';
import s from './GridLayout.module.css';

interface GridLayoutProps {
  children: ReactNode;
}

const GridLayout = ({ children }: GridLayoutProps) => {
  return <div className={s.container}>{children}</div>;
};

export default GridLayout;
