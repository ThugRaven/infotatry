import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import { Button, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import s from './MapSidebar.module.css';

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onWidthChange: (width: number) => void;
  isLoading: boolean;
  error: Error | null;
  data: any;
  onSearch: () => void;
}

const MapSidebar = ({
  isOpen,
  onToggle,
  onWidthChange,
  isLoading,
  error,
  data,
  onSearch,
}: MapSidebarProps) => {
  const ref = useRef<HTMLDivElement>(null);

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
        <Button mt={2} onClick={onSearch}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default MapSidebar;
