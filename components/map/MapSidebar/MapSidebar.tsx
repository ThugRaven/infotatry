import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import styles from './MapSidebar.module.css';

// interface MapSidebarProps {
//   prop: string;
// }

const MapSidebar = () => {
  return (
    <div className={styles.container}>
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
        <Input type="text" placeholder="Szukaj..." />
      </InputGroup>
    </div>
  );
};

export default MapSidebar;
