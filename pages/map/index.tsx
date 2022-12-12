import { MainLayout } from '@components/layouts';
import { MapContainer, MapSidebar } from '@components/map';
import s from '@styles/MapPage.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { SearchForm } from '../../components/map/MapSidebar/MapSidebar';

const MapPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(0);
  const [query, setQuery] = useState<SearchForm | null>(null);

  const onToggle = () => {
    setIsOpen((open) => !open);
  };

  const onWidthChange = (width: number) => {
    setWidth(width);
  };

  const fetchRoute = async (query: SearchForm | null) => {
    try {
      console.log('fetch');
      console.log(query);

      const response = await fetch(`http://localhost:8080/route/${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

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

  const { isLoading, error, data } = useQuery<any, Error>(
    ['route', query],
    () => fetchRoute(query),
    {
      enabled: Boolean(query),
      refetchOnWindowFocus: false,
    },
  );

  const handleSearch = (searchForm: SearchForm) => {
    let searchQuery = '';
    for (const key in searchForm) {
      const element = searchForm[key];
      searchQuery = searchQuery.concat(element + ';');
    }
    console.log(searchQuery);
    setQuery(searchQuery);
  };

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
          onSearch={handleSearch}
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
