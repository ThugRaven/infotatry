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
  colors: string[];
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
  segments?: Segment[];
  onClick: (index: number) => void;
}

const RouteTrails = ({ segments }: { segments?: Segment[] }) => {
  // const totalDistance = useMemo(
  //   () => segments.reduce((sum, segment) => sum + segment.distance, 0),
  //   [segments],
  // );
  const totalDistance =
    segments?.reduce((sum, segment) => sum + segment.distance, 0) ?? 0;

  const totalCumulativeDistance =
    segments?.reduce(
      (sum, segment) => sum + segment.distance * segment.colors.length,
      0,
    ) ?? 0;

  const trailSegments = {
    red: 0,
    blue: 0,
    yellow: 0,
    green: 0,
    black: 0,
  };

  segments?.forEach((segment) => {
    segment.colors.forEach((color) => {
      switch (color) {
        case 'red': {
          console.log('red');
          trailSegments.red += segment.distance;
          break;
        }
        case 'blue': {
          console.log('blue');
          trailSegments.blue += segment.distance;
          break;
        }
        case 'yellow': {
          console.log('yellow');
          trailSegments.yellow += segment.distance;
          break;
        }
        case 'green': {
          console.log('green');
          trailSegments.green += segment.distance;
          break;
        }
        case 'black': {
          console.log('black');
          trailSegments.black += segment.distance;
          break;
        }
      }
    });
  });

  console.log(totalDistance, trailSegments);

  return (
    <div className={s.trails}>
      {Object.entries(trailSegments).map((segment) => (
        <div
          className={classNames(s.trail, s[`trail--${segment[0]}`])}
          style={{
            width: `${(segment[1] / totalCumulativeDistance) * 100}%`,
          }}
          data-part={(segment[1] / totalDistance) * 100}
        ></div>
      ))}
    </div>
  );
};

const RouteResult = ({
  index,
  active,
  type,
  distance,
  time,
  ascent,
  descent,
  segments,
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
        <RouteTrails segments={segments} />
      </a>
    </li>
  );
};

export default RouteResult;
