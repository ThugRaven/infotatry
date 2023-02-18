import AvalancheDry1 from '@components/icons/AvalancheDry1';
import AvalancheDry2 from '@components/icons/AvalancheDry2';
import AvalancheDry3 from '@components/icons/AvalancheDry3';
import AvalancheDry4_5 from '@components/icons/AvalancheDry4_5';
import AvalancheWet1 from '@components/icons/AvalancheWet1';
import AvalancheWet2 from '@components/icons/AvalancheWet2';
import AvalancheWet3 from '@components/icons/AvalancheWet3';
import AvalancheWet4_5 from '@components/icons/AvalancheWet4_5';
import classNames from 'classnames';
import s from './AvalancheInfo.module.css';

interface AvalancheInfoProps {
  level: number | null;
  increase?: boolean;
}

const AvalancheInfo = ({ level, increase = false }: AvalancheInfoProps) => {
  const _level = level && level >= 0 && level <= 5 ? level : null;

  return (
    <div className={classNames(s.avalanche, s[`avalanche--${_level}`])}>
      <span className={s.level}>{_level}</span>
      <div className={s.level__icon}>
        {_level === 1 ? (
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
