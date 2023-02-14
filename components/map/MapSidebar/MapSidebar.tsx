import { Spinner } from '@chakra-ui/react';
import AvalancheInfo from '@components/avalanche/AvalancheInfo';
import RouteResult from '@components/route/RouteResult';
import RouteSegments from '@components/route/RouteSegments';
import { SearchRoute } from '@components/search';
import Button from '@components/ui/Button';
import CurrentWeather from '@components/weather/CurrentWeather';
import { PopupState } from 'pages/map';
import { useEffect, useRef } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { CurrentWeatherResponse } from 'types/weather-types';
import s from './MapSidebar.module.css';

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onWidthChange: (width: number) => void;
  isLoading: boolean;
  error: Error | null;
  data: any;
  onSearch: (searchForm: SearchForm) => void;
  onPlanHike: () => void;
  index: number;
  onSelectRoute: (index: number) => void;
  popupState: PopupState;
  dangerLevel: number | null;
  currentWeather?: CurrentWeatherResponse;
  onWeatherModalOpen: () => void;
  onHover: (id: number, type: 'node' | 'trail') => void;
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
  currentWeather,
  onWeatherModalOpen,
  onHover,
}: MapSidebarProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    onWidthChange(ref.current.offsetWidth);
  }, [onWidthChange]);

  return (
    <div className={s.wrapper}>
      <div className={`${s.container} ${!isOpen ? s.collapsed : ''}`} ref={ref}>
        <button className={s.toggle} onClick={onToggle}>
          <MdChevronLeft
            className={`${s.toggle__icon} ${!isOpen ? s.rotate : ''}`}
          />
        </button>

        <div className={s.content}>
          <SearchRoute onSearch={onSearch} popupState={popupState} />
          {isLoading ? (
            <div className={s.spinner}>
              <Spinner thickness="5px" size="xl" color="black" />
            </div>
          ) : error ? (
            'An error has occured: ' + error.message
          ) : data && data.length > 0 ? (
            <>
              <ul>
                {data.map((route: any, idx: number) => (
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
                location={data[index].weatherSite?.name}
                weather={currentWeather}
                onWeatherModalOpen={onWeatherModalOpen}
              />
            </>
          ) : (
            data && data.message
          )}

          <AvalancheInfo level={dangerLevel} />
          <RouteSegments
            segments={(data && data[index].segments) ?? []}
            onHover={onHover}
          />
        </div>
      </div>
    </div>
  );
};

export default MapSidebar;
