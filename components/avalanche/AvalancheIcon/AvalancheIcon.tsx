import AvalancheDry0 from '@components/icons/AvalancheDry0';
import AvalancheDry1 from '@components/icons/AvalancheDry1';
import AvalancheDry2 from '@components/icons/AvalancheDry2';
import AvalancheDry3 from '@components/icons/AvalancheDry3';
import AvalancheDry4_5 from '@components/icons/AvalancheDry4_5';
import AvalancheWet1 from '@components/icons/AvalancheWet1';
import AvalancheWet2 from '@components/icons/AvalancheWet2';
import AvalancheWet3 from '@components/icons/AvalancheWet3';
import AvalancheWet4_5 from '@components/icons/AvalancheWet4_5';
import { getAvalancheLevelName } from '@lib/utils';
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
  const _level = level != null && level >= 0 && level <= 5 ? level : null;
  const levelText = getAvalancheLevelName(level);
  const increaseText = increase ? '(wraz ze wzrostem temperatury)' : null;
  const titleText =
    _level != null && levelText
      ? `${_level} - ${levelText} ${increaseText ?? ''}`.trim()
      : '';

  return (
    <div className={classNames(s.avalanche, className)} {...props}>
      <span className={classNames(s.level, levelClassName)}>
        {_level != null && _level > 0 ? _level : null}
      </span>
      <div
        title={titleText}
        className={classNames(s.level__icon, levelIconClassName)}
      >
        {_level === 0 ? (
          <AvalancheDry0 />
        ) : _level === 1 ? (
          !increase ? (
            <AvalancheDry1 />
          ) : (
            <AvalancheWet1 />
          )
        ) : _level === 2 ? (
          !increase ? (
            <AvalancheDry2 />
          ) : (
            <AvalancheWet2 />
          )
        ) : _level === 3 ? (
          !increase ? (
            <AvalancheDry3 />
          ) : (
            <AvalancheWet3 />
          )
        ) : _level === 4 || _level === 5 ? (
          !increase ? (
            <AvalancheDry4_5 />
          ) : (
            <AvalancheWet4_5 />
          )
        ) : null}
      </div>
    </div>
  );
};

export default AvalancheIcon;
