import { TrailMarking } from '@components/common';
import CaveIcon from '@components/icons/CaveIcon';
import NodeIcon from '@components/icons/NodeIcon';
import ShelterIcon from '@components/icons/ShelterIcon';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import classNames from 'classnames';
import { TrailColor } from 'pages/dashboard/admin/map';
import { MdErrorOutline, MdLandscape } from 'react-icons/md';
import s from './RouteSegments.module.css';

type TrailSegment = {
  name: string;
  colors: TrailColor[];
  distance: number;
  time: number;
  closed: boolean;
  type: string;
};

interface RouteSegmentsProps {
  segments: TrailSegment[];
  onClick?: () => void;
}

const RouteSegments = ({ segments, onClick }: RouteSegmentsProps) => {
  console.log('segments', segments);

  const handleClick = () => {
    // onClick();
  };

  let totalTime = 0;
  let totalDistance = 0;

  return (
    <section>
      <h2>Przebieg trasy</h2>
      <ul className={s.list}>
        {segments.map((segment, index) => {
          const _totalTime = totalTime;
          const _totalDistance = totalDistance;
          totalTime += segment.time;
          totalDistance += segment.distance;

          return (
            <>
              <li key={`${index}-node`}>
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
                <li key={`${index}-trail`}>
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
            </>
          );
        })}
      </ul>
    </section>
  );
};

export default RouteSegments;
