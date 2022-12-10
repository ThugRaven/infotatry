import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import { Button, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import s from './MapSidebar.module.css';

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onWidthChange: (width: number) => void;
}

const MapSidebar = ({ isOpen, onToggle, onWidthChange }: MapSidebarProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const fetchRoute = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/route/Palenica Białczańska;Rówień Waksmundzka',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const { isLoading, error, data, refetch } = useQuery<any, Error>(
    'route',
    fetchRoute,
    {
      enabled: false,
    },
  );

  useEffect(() => {
    if (!ref.current) return;
    onWidthChange(ref.current.offsetWidth);
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={`${s.container} ${!isOpen ? s.collapsed : ''}`} ref={ref}>
        <button className={s.toggle} onClick={onToggle}>
          <ChevronLeftIcon
            w={6}
            h={6}
            className={`${s.toggle__icon} ${!isOpen ? s.rotate : ''}`}
          />
        </button>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
          <Input type="text" placeholder="Szukaj..." />
        </InputGroup>
        {isLoading
          ? 'Loading...'
          : error
          ? 'An error has occured: ' + error.message
          : data && data.route
          ? `${data.route.name.start} - ${data.route.name.end} - ${data.route.distance}m`
          : data && data.message}
        <Button mt={2} onClick={() => refetch()}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default MapSidebar;
