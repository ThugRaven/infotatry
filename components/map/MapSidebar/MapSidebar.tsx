import { Button, Spinner } from '@chakra-ui/react';
import AvalancheInfo from '@components/avalanche/AvalancheInfo';
import RouteResult from '@components/route/RouteResult';
import { SearchRoute } from '@components/search';
import { PopupState } from 'pages/map';
import { useEffect, useRef } from 'react';
import { MdChevronLeft } from 'react-icons/md';
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
          <Button colorScheme="blue" mt={2} onClick={onPlanHike}>
            Plan a hike
          </Button>

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
            </>
          ) : (
            data && data.message
          )}

          <AvalancheInfo level={dangerLevel} />

          {/* <HStack justifyContent={'center'} mt={2}>
          <IconButton aria-label="Previous route" onClick={onPreviousRoute}>
          <ChevronLeftIcon boxSize={6} />
          </IconButton>
          <IconButton aria-label="Next route" onClick={onNextRoute}>
            <ChevronRightIcon boxSize={6} />
          </IconButton>
        </HStack> */}
        </div>
      </div>
    </div>
  );
};

export default MapSidebar;
