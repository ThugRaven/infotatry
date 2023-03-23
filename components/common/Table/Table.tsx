import classNames from 'classnames';
import { ReactNode } from 'react';
import LoadingOverlay from '../LoadingOverlay';
import s from './Table.module.css';

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  active?: boolean;
}

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  isNumeric?: boolean;
  center?: boolean;
  wrap?: boolean;
}

interface ThProps extends React.ComponentPropsWithoutRef<'th'> {
  children: ReactNode;
  isNumeric?: boolean;
  center?: boolean;
}

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export const Tr = ({ children, active, ...props }: TrProps) => {
  return (
    <tr
      className={classNames(s.tr, {
        [s['tr--active']]: active,
      })}
      {...props}
    >
      {children}
    </tr>
  );
};

export const Td = ({
  children,
  isNumeric,
  center,
  wrap,
  ...props
}: TdProps) => {
  return (
    <td
      className={classNames(s.td, {
        [s['td--numeric']]: isNumeric,
        [s['td--center']]: center,
        [s['td--wrap']]: wrap,
      })}
      {...props}
    >
      {children}
    </td>
  );
};

export const Th = ({ children, isNumeric, center, ...props }: ThProps) => {
  return (
    <th
      className={classNames(s.th, {
        [s['th--numeric']]: isNumeric,
        [s['th--center']]: center,
      })}
      {...props}
    >
      {children}
    </th>
  );
};

export const Table = ({
  children,
  isLoading = false,
  ...props
}: TableProps) => {
  return (
    <div className={s.container} {...props}>
      {isLoading && <LoadingOverlay />}
      <table className={s.table}>{children}</table>
    </div>
  );
};
