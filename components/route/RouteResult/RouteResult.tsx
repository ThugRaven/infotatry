import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import classNames from 'classnames';
import {
  MdCheckCircleOutline,
  MdErrorOutline,
  MdTrendingDown,
  MdTrendingUp,
} from 'react-icons/md';
import s from './RouteResult.module.css';

type Segment = {
  color: string;
  distance: number;
};

interface RouteResultProps {
  index: number;
  active: boolean;
  type: string;
  distance: number;
  time: number;
  ascent: number;
  descent: number;
  trails?: Segment[];
  onClick: (index: number) => void;
}

const RouteResult = ({
  index,
  active,
  type,
  distance,
  time,
  ascent,
  descent,
  onClick,
}: RouteResultProps) => {
  const handleClick = () => {
    onClick(index);
  };

  const routeMessage = (
    <div
      className={classNames(s.route__message, {
        [s['route__message--shortest']]:
          type === 'shortest' || type === 'normal',
        [s['route__message--closed']]: type === 'closed',
      })}
    >
      <div>
        {type === 'shortest' || type === 'normal' ? (
          <MdCheckCircleOutline />
        ) : (
          <MdErrorOutline />
        )}
      </div>
      <span>
        {type === 'shortest'
          ? 'Najkrótsza trasa'
          : type === 'normal'
          ? 'Brak utrudnień'
          : 'Zamknięte szlaki'}
      </span>
    </div>
  );

  return (
    <li key={index}>
      <a
        className={classNames(s.route, { [s['route--active']]: active })}
        onClick={handleClick}
      >
        <div className={s.stats__main}>
          <span className={s.value}>
            {formatMinutesToHours(time)}
            <span className={s.unit}>h</span>
          </span>
          <span className={s.value}>
            {formatMetersToKm(distance)}
            <span className={s.unit}>km</span>
          </span>
        </div>
        <div
          className={classNames(
            s.stats__elevation,
            s['stats__elevation--ascent'],
          )}
        >
          <MdTrendingUp className={s.icon} />
          <span className={s.value}>
            {ascent}
            <span className={s.unit}>m</span>
          </span>
        </div>
        <div
          className={classNames(
            s.stats__elevation,
            s['stats__elevation--descent'],
          )}
        >
          <MdTrendingDown className={s.icon} />
          <span className={s.value}>
            {descent}
            <span className={s.unit}>m</span>
          </span>
        </div>
        {routeMessage}
      </a>
    </li>
  );
};

export default RouteResult;
