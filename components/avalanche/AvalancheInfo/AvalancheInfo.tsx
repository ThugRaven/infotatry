import AvalancheDry1 from '@components/icons/AvalancheDry1';
import AvalancheDry2 from '@components/icons/AvalancheDry2';
import AvalancheDry3 from '@components/icons/AvalancheDry3';
import AvalancheDry4_5 from '@components/icons/AvalancheDry4_5';
import classNames from 'classnames';
import s from './AvalancheInfo.module.css';

interface AvalancheInfoProps {
  level: number | null;
}

const AvalancheInfo = ({ level }: AvalancheInfoProps) => {
  const _level = level && level >= 0 && level <= 5 ? level : null;

  return (
    <div className={classNames(s.avalanche, s[`avalanche--${_level}`])}>
      <span className={s.level}>{_level}</span>
      <div className={s.level__icon}>
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
      <span className={s.level__name}>
        {_level === 1
          ? 'Niskie'
          : _level === 2
          ? 'Umiarkowane'
          : _level === 3
          ? 'Znaczne'
          : _level === 4
          ? 'Wysokie'
          : _level === 5
          ? 'Bardzo wysokie'
          : null}
      </span>
    </div>
  );
};

export default AvalancheInfo;
