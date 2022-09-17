import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useState } from 'react';
import { MainLayout } from '../../components/layouts';
import { MapContainer, MapSidebar } from '../../components/map';
import styles from '../../styles/MapPage.module.css';

const MapPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(0);

  const onToggle = () => {
    setIsOpen((open) => !open);
  };

  const onWidthChange = (width: number) => {
    setWidth(width);
  };

  return (
    <>
      <div className={styles.container}>
        <MapSidebar
          isOpen={isOpen}
          onToggle={onToggle}
          onWidthChange={onWidthChange}
        />
        <MapContainer padding={isOpen ? 0 : width} />
      </div>
    </>
  );
};

MapPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default MapPage;
