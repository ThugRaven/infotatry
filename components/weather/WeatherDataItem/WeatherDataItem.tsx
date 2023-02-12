import classNames from 'classnames';
import { LiHTMLAttributes, ReactNode } from 'react';
import s from './WeatherDataItem.module.css';

interface WeatherDataItemProps {
  data: {
    name?: string;
    value: string | number;
    unit?: string;
  };
  center?: boolean;
  children?: ReactNode;
}

const WeatherDataItem = ({
  data,
  center = false,
  children,
  className,
}: WeatherDataItemProps & LiHTMLAttributes<HTMLLIElement>) => {
  return (
    <li
      className={classNames(
        s.item,
        {
          [s['item--center']]: center,
        },
        className,
      )}
    >
      {children}
      {data.name && <span>{data.name}</span>}
      <span className={s.value}>{data.value}</span>
      {data.unit && <span>{data.unit}</span>}
    </li>
  );
};

export default WeatherDataItem;
