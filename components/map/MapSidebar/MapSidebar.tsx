import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import { Button, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import s from './MapSidebar.module.css';

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onWidthChange: (width: number) => void;
}

const MapSidebar = ({ isOpen, onToggle, onWidthChange }: MapSidebarProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    onWidthChange(ref.current.offsetWidth);
  }, []);

  const handleRouteSearch = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/route/Palenica Białczańska;Rówień Waksmundzka',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      console.log(response);
      console.log(response.json().then((data) => console.log(data)));
    } catch (error) {
      console.log('error');
    }
  };

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
        <Button mt={2} onClick={handleRouteSearch}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default MapSidebar;
