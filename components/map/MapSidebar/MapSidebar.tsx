import { Spinner, useMediaQuery } from '@chakra-ui/react';
import { AvalancheInfo } from '@components/avalanche';
import { ErrorText } from '@components/common';
import { RouteResult } from '@components/route';
import { SearchRoute } from '@components/search';
import { Button } from '@components/ui';
import { CurrentWeather } from '@components/weather';
import classNames from 'classnames';
import { PopupState } from 'pages';
import { memo, useEffect, useRef } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { Route } from 'types/route-types';
import { CurrentWeatherResponse } from 'types/weather-types';
import s from './MapSidebar.module.css';
import RouteSegmentsNew from '@components/route/RouteSegmentsNew';

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onWidthChange: (width: number) => void;
  isLoading: boolean;
  error: Error | null;
  data?: Route[];
  onSearch: (searchForm: SearchForm | null) => void;
  onPlanHike: () => void;
  index: number;
  onSelectRoute: (index: number) => void;
  popupState: PopupState;
  dangerLevel: number | null;
  increase?: boolean;
  currentWeather?: CurrentWeatherResponse;
  onWeatherModalOpen: () => void;
  onHover: (id: number, type: 'node' | 'trail') => void;
  onSelectSegment: (id: number, type: 'node' | 'trail') => void;
  className?: string;
}

export type SearchForm = { [key: number]: string };

const MapSidebar = ({
  isOpen,
  onToggle,
  onWidthChange,
  isLoading,
  error,
  data,
  onSearch,
  onPlanHike,
  index,
  onSelectRoute,
  popupState,
  dangerLevel,
  increase,
  currentWeather,
  onWeatherModalOpen,
  onHover,
  onSelectSegment,
  className,
}: MapSidebarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDesktopSidebar] = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (!ref.current) return;
    onWidthChange(isDesktopSidebar ? ref.current.offsetWidth : 0);
  }, [onWidthChange, isDesktopSidebar]);

  const handleClear = () => {
    onSearch(null);
  };

  return (
    <div
      className={classNames(
        s.wrapper,
        {
          [s['wrapper--collapsed']]: !isOpen,
        },
        className,
      )}
      ref={ref}
    >
      <div className={`${s.container} ${!isOpen ? s.collapsed : ''}`}>
        <button className={s.toggle} onClick={onToggle}>
          <MdChevronLeft
            className={`${s.toggle__icon} ${!isOpen ? s.rotate : ''}`}
          />
        </button>

        <div className={s.content}>
          <SearchRoute
            onSearch={onSearch}
            onClear={handleClear}
            popupState={popupState}
            hasRoute={(data && data.length > 0) || false}
          />
          {isLoading ? (
            <div className={s.spinner}>
              <Spinner thickness="5px" size="xl" color="black" />
            </div>
          ) : error && error.message === 'Route not found' ? (
            <ErrorText>Nie znaleziono trasy</ErrorText>
          ) : error ? (
            <ErrorText>Wystąpił błąd</ErrorText>
          ) : (
            data &&
            data.length > 0 && (
              <>
                <ul>
                  {data.map((route: Route, idx: number) => (
                    <RouteResult
                      key={idx}
                      index={idx}
                      active={index === idx}
                      type={route.type}
                      distance={route.distance}
                      time={route.time}
                      ascent={route.ascent}
                      descent={route.descent}
                      segments={route.segments}
                      onClick={() => onSelectRoute(idx)}
                    />
                  ))}
                </ul>
                <Button className={s['plan-btn']} onClick={onPlanHike}>
                  Zaplanuj wędrówkę
                </Button>
                <CurrentWeather
                  location={data[index].weatherSite}
                  weather={currentWeather}
                  onWeatherModalOpen={onWeatherModalOpen}
                />
              </>
            )
          )}

          <AvalancheInfo level={dangerLevel} increase={increase} />
          <RouteSegmentsNew
            segments={(data && data[index].segments) ?? []}
            onHover={onHover}
            onSelectSegment={onSelectSegment}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(MapSidebar);
