import { MainLayout } from '@components/layouts';
import { MapContainer, MapSidebar } from '@components/map';
import s from '@styles/MapPage.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';

const MapPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(0);

  const onToggle = () => {
    setIsOpen((open) => !open);
  };

  const onWidthChange = (width: number) => {
    setWidth(width);
  };

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

  return (
    <>
      <div className={s.container}>
        <MapSidebar
          isOpen={isOpen}
          onToggle={onToggle}
          onWidthChange={onWidthChange}
          isLoading={isLoading}
          error={error}
          data={data}
          onSearch={() => refetch()}
        />
        <MapContainer
          padding={isOpen ? width : 0}
          trailIds={data?.route.trails}
        />
      </div>
    </>
  );
};

MapPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default MapPage;
