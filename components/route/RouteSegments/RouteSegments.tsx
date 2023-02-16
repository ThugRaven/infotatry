import { TrailMarking } from '@components/common';
import CaveIcon from '@components/icons/CaveIcon';
import NodeIcon from '@components/icons/NodeIcon';
import ShelterIcon from '@components/icons/ShelterIcon';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import classNames from 'classnames';
import { TrailColor } from 'pages/dashboard/admin/map';
import { Fragment } from 'react';
import { MdErrorOutline, MdLandscape } from 'react-icons/md';
import s from './RouteSegments.module.css';

export type TrailSegment = {
  name: string;
  colors: TrailColor[];
  distance: number;
  time: number;
  closed: boolean;
  type: string;
  node_id: number;
  trail_id: number;
};

interface RouteSegmentsProps {
  segments: TrailSegment[];
  onClick?: () => void;
  onHover: (id: number, type: 'node' | 'trail') => void;
}

const RouteSegments = ({ segments, onClick, onHover }: RouteSegmentsProps) => {
  const handleClick = () => {
    // onClick();
  };

  let totalTime = 0;
  let totalDistance = 0;

  return segments.length > 0 ? (
    <section>
      <h2 className={s.title}>Przebieg trasy</h2>
      <ul className={s.list}>
        {segments.map((segment, index) => {
          const _totalTime = totalTime;
          const _totalDistance = totalDistance;
          totalTime += segment.time;
          totalDistance += segment.distance;

          return (
            <Fragment key={index}>
              <li
                key={`${index}-node`}
                onMouseOver={() => onHover(segment.node_id, 'node')}
                onMouseLeave={() => onHover(-1, 'node')}
              >
                <a onClick={handleClick}>
                  <div className={classNames(s.item, s['item--node'])}>
                    <div className={s.wrapper}>
                      {segment.type === 'shelter' ? (
                        <ShelterIcon className={s.icon} />
                      ) : segment.type === 'peak' ? (
                        <MdLandscape className={s.icon} />
                      ) : segment.type === 'cave' ? (
                        <CaveIcon className={s.icon} />
                      ) : (
                        <NodeIcon className={s.icon} />
                      )}

                      <span className={s.item__name}>{segment.name}</span>
                    </div>
                    <div className={s.item__stats}>{`${formatMinutesToHours(
                      _totalTime,
                      true,
                    )} (${formatMetersToKm(_totalDistance, true)})`}</div>
                  </div>
                </a>
              </li>
              {segment.distance > 0 && (
                <li
                  key={`${index}-trail`}
                  onMouseOver={() => onHover(segment.trail_id, 'trail')}
                  onMouseLeave={() => onHover(-1, 'trail')}
                >
                  <a onClick={handleClick}>
                    <div className={classNames(s.item, s['item--trail'])}>
                      <div className={s.wrapper}>
                        <div className={s.markings}>
                          {segment.colors.map((color) => (
                            <TrailMarking
                              key={color}
                              color={color}
                              size={'md'}
                            />
                          ))}
                        </div>
                        <span>{`${
                          segment.time >= 60
                            ? formatMinutesToHours(segment.time, true)
                            : `${segment.time} min.`
                        } (${
                          segment.distance > 1000
                            ? formatMetersToKm(segment.distance, true)
                            : `${segment.distance} m`
                        })`}</span>
                      </div>
                      {segment.closed && (
                        <MdErrorOutline
                          className={s.closed}
                          title={'Zamknięcie szlaku'}
                        />
                      )}
                    </div>
                  </a>
                </li>
              )}
            </Fragment>
          );
        })}
      </ul>
    </section>
  ) : null;
};

export default RouteSegments;
