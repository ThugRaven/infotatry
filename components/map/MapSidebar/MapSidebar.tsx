import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import styles from './MapSidebar.module.css';

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

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.container} ${!isOpen ? styles.collapsed : ''}`}
        ref={ref}
      >
        <button className={styles.toggle} onClick={onToggle}>
          <ChevronLeftIcon
            w={6}
            h={6}
            className={`${styles.toggle__icon} ${!isOpen ? styles.rotate : ''}`}
          />
        </button>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
          <Input type="text" placeholder="Szukaj..." />
        </InputGroup>
      </div>
    </div>
  );
};

export default MapSidebar;
