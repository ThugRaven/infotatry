import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MdCheckCircleOutline,
  MdErrorOutline,
  MdTrendingDown,
  MdTrendingUp,
} from 'react-icons/md';
import s from './RouteResult.module.css';

type Segment = {
  color: string[];
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
      (sum, segment) => sum + segment.distance * segment.color.length,
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
    segment.color.forEach((color) => {
      switch (color) {
        case 'red': {
          trailSegments.red += segment.distance;
          break;
        }
        case 'blue': {
          trailSegments.blue += segment.distance;
          break;
        }
        case 'yellow': {
          trailSegments.yellow += segment.distance;
          break;
        }
        case 'green': {
          trailSegments.green += segment.distance;
          break;
        }
        case 'black': {
          trailSegments.black += segment.distance;
          break;
        }
      }
    });
  });

  const [value, setValue] = useState('');
  const [hover, setHover] = useState(false);
  const [x, setX] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // console.log(e);
      // console.log(e.x, e.y);
      // console.log(hover);

      if (ref.current && tooltipRef.current && hover) {
        const tooltipWidth = tooltipRef.current.getBoundingClientRect().width;
        const posX = e.clientX - ref.current.getBoundingClientRect().left;
        const width = ref.current.getBoundingClientRect().width;
        const padding = 10;
        // console.log(posX, width);

        setX(
          posX <= tooltipWidth / 2 + padding
            ? tooltipWidth / 2 + padding
            : posX > width - tooltipWidth / 2 - padding
            ? width - tooltipWidth / 2 - padding
            : posX,
        );
      }
    },
    [hover],
  );

  useEffect(() => {
    const div = ref.current;
    if (div) {
      div.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (div) {
        div.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [handleMouseMove]);

  // console.log(totalDistance, totalCumulativeDistance, trailSegments);

  return (
    <>
      {segments && segments.length > 1 && (
        <div
          ref={ref}
          className={s.trails}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div
            ref={tooltipRef}
            className={classNames(s.tooltip, { [s['tooltip--active']]: hover })}
            style={{ left: x }}
          >
            {`${value}%`}
          </div>

          {Object.entries(trailSegments).map((segment) => (
            <div
              key={segment[0]}
              className={classNames(s.trail, s[`trail--${segment[0]}`])}
              style={{
                width: `${(segment[1] / totalCumulativeDistance) * 100}%`,
              }}
              data-part={((segment[1] / totalDistance) * 100).toFixed(2)}
              onMouseOver={() =>
                setValue(((segment[1] / totalDistance) * 100).toFixed(2))
              }
            ></div>
          ))}
        </div>
      )}
    </>
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
    <li>
      <a
        className={classNames(s.route, { [s['route--active']]: active })}
        onClick={handleClick}
      >
        <div className={s.stats__main}>
          <span className={s.value} title={`${time} min.`}>
            {formatMinutesToHours(time)}
            <span className={s.unit}>h</span>
          </span>
          <span className={s.value} title={`${distance} m`}>
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
