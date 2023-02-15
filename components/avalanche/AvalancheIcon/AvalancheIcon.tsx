import AvalancheDry1 from '@components/icons/AvalancheDry1';
import AvalancheDry2 from '@components/icons/AvalancheDry2';
import AvalancheDry3 from '@components/icons/AvalancheDry3';
import AvalancheDry4_5 from '@components/icons/AvalancheDry4_5';
import classNames from 'classnames';
import s from './AvalancheIcon.module.css';

interface AvalancheIconProps {
  level: number | null;
  increase?: boolean;
  levelClassName?: string;
  levelIconClassName?: string;
}

const AvalancheIcon = ({
  level,
  increase = false,
  className,
  levelClassName,
  levelIconClassName,
  ...props
}: AvalancheIconProps & React.HTMLAttributes<HTMLDivElement>) => {
  const _level = level && level >= 0 && level <= 5 ? level : null;

  return (
    <div className={classNames(s.avalanche, className)} {...props}>
      <span className={classNames(s.level, levelClassName)}>{_level}</span>
      <div className={classNames(s.level__icon, levelIconClassName)}>
        {_level === 1 ? (
          <AvalancheDry1 />
        ) : _level === 2 ? (
          <AvalancheDry2 />
        ) : _level === 3 ? (
          <AvalancheDry3 />
        ) : _level === 4 || _level === 5 ? (
          <AvalancheDry4_5 />
        ) : null}
      </div>
    </div>
  );
};

export default AvalancheIcon;
