import { TrailMarking } from '@components/common';
import CaveIcon from '@components/icons/CaveIcon';
import NodeIcon from '@components/icons/NodeIcon';
import ShelterIcon from '@components/icons/ShelterIcon';
import { formatMetersToKm, formatMinutesToHours } from '@lib/utils';
import classNames from 'classnames';
import { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  MdChevronLeft,
  MdChevronRight,
  MdErrorOutline,
  MdFirstPage,
  MdLandscape,
  MdLastPage,
} from 'react-icons/md';
import { Segment } from 'types/hikes-types';
import { TrailSegment } from 'types/route-types';
import s from './RouteSegmentsNew.module.css';
import { useKeyboard } from 'hooks/useKeyboard';
import { useMediaQuery } from '@chakra-ui/react';

interface RouteSegmentsProps {
  segments: TrailSegment[] | Segment[];
  onHover: (id: number, type: 'node' | 'trail') => void;
  onSelectSegment: (id: number, type: 'node' | 'trail') => void;
  onClick: (id: number, type: 'node' | 'trail') => void;
  isCollapsed: boolean;
}

const RouteSegmentsNew = ({
  segments,
  onHover,
  onSelectSegment,
  onClick,
  isCollapsed,
}: RouteSegmentsProps) => {
  let totalTime = 0;
  let totalDistance = 0;
  const [segmentIndex, setSegmentIndex] = useState(-1);
  const mappedSegments: {
    type: 'trail' | 'node';
    segment: TrailSegment | Segment;
  }[] = useMemo(() => {
    const _mappedSegments: {
      type: 'trail' | 'node';
      segment: TrailSegment | Segment;
    }[] = [];

    for (const segment of segments) {
      _mappedSegments.push({ type: 'node', segment });
      if (segment.distance > 0) {
        _mappedSegments.push({ type: 'trail', segment });
      }
    }

    return _mappedSegments;
  }, [segments]);

  const ref = useRef<HTMLUListElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const onNextSegment = () => {
    setSegmentIndex((v) => (v < mappedSegments.length - 1 ? v + 1 : v));
  };

  const onPreviousSegment = () => {
    setSegmentIndex((v) => (v > 0 ? v - 1 : 0));
  };

  const onFirstSegment = () => {
    setSegmentIndex(0);
  };

  const onLastSegment = () => {
    setSegmentIndex(mappedSegments.length - 1);
  };

  const [isDesktopSidebar] = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (!mappedSegments[segmentIndex]) {
      return;
    }

    const { segment, type } = mappedSegments[segmentIndex];
    onSelectSegment(
      type === 'trail' ? segment.trail_id : segment.node_id,
      type,
    );

    ref.current?.querySelectorAll('li')[segmentIndex].scrollIntoView({
      behavior: 'smooth',
      block: !isDesktopSidebar && isCollapsed ? 'end' : 'center',
    });
  }, [
    mappedSegments,
    onSelectSegment,
    segmentIndex,
    isDesktopSidebar,
    isCollapsed,
  ]);

  useKeyboard(['ArrowLeft', 'ArrowRight'], keyboardRef.current, [
    () => {
      onPreviousSegment();
    },
    () => {
      onNextSegment();
    },
  ]);

  return mappedSegments.length > 0 ? (
    <section ref={keyboardRef}>
      <h2 className={s.title}>Przebieg trasy</h2>
      <div className={s.controls}>
        <button
          onClick={onFirstSegment}
          className={s.controls__btn}
          title="Pierwszy"
        >
          <MdFirstPage className={s.controls__icon} />
        </button>
        <button
          onClick={onPreviousSegment}
          className={s.controls__btn}
          title="Poprzedni (←)"
        >
          <MdChevronLeft className={s.controls__icon} />
        </button>
        <button
          onClick={onNextSegment}
          className={s.controls__btn}
          title="Następny (→)"
        >
          <MdChevronRight className={s.controls__icon} />
        </button>
        <button
          onClick={onLastSegment}
          className={s.controls__btn}
          title="Ostatni"
        >
          <MdLastPage className={s.controls__icon} />
        </button>
      </div>
      <ul className={s.list} ref={ref}>
        {mappedSegments.map(({ type, segment }, index) => {
          if (type === 'node') {
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
                  onClick={() => {
                    setSegmentIndex((v) => (v === index ? -1 : index));
                    onClick(segment.node_id, 'node');
                  }}
                >
                  <div
                    className={classNames(s.item, s['item--node'], {
                      [s['item--selected']]: index == segmentIndex,
                    })}
                  >
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
                </li>
              </Fragment>
            );
          } else if (type === 'trail') {
            return (
              <Fragment key={index}>
                {segment.distance > 0 && (
                  <li
                    key={`${index}-trail`}
                    onMouseOver={() => onHover(segment.trail_id, 'trail')}
                    onMouseLeave={() => onHover(-1, 'trail')}
                    onClick={() => {
                      setSegmentIndex((v) => (v === index ? -1 : index));
                      onClick(segment.trail_id, 'trail');
                    }}
                  >
                    <div
                      className={classNames(s.item, s['item--trail'], {
                        [s['item--selected']]: index == segmentIndex,
                      })}
                    >
                      <div className={s.wrapper}>
                        <div className={s.markings}>
                          {segment.color.map((color) => (
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
                      {'closed' in segment && segment.closed && (
                        <MdErrorOutline
                          className={s.closed}
                          title={'Zamknięcie szlaku'}
                        />
                      )}
                    </div>
                  </li>
                )}
              </Fragment>
            );
          }
        })}
      </ul>
    </section>
  ) : null;
};

export default memo(RouteSegmentsNew);
