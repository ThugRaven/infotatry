import { getAvalancheLevelName } from '@lib/utils';
import classNames from 'classnames';
import AvalancheIcon from '../AvalancheIcon/AvalancheIcon';
import s from './AvalancheInfo.module.css';

interface AvalancheInfoProps {
  level: number | null;
  increase?: boolean;
}

const AvalancheInfo = ({ level, increase = false }: AvalancheInfoProps) => {
  const _level = level && level >= 0 && level <= 5 ? level : null;

  return (
    <div className={classNames(s.avalanche, s[`avalanche--${_level}`])}>
      <AvalancheIcon
        level={_level}
        increase={increase}
        levelClassName={s.level}
        levelIconClassName={s.level__icon}
      />
      <span className={s.level__name}>{getAvalancheLevelName(level)}</span>
    </div>
  );
};

export default AvalancheInfo;
