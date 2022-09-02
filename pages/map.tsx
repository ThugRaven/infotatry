import 'mapbox-gl/dist/mapbox-gl.css';
import Head from 'next/head';
import { ReactElement, useRef } from 'react';
import { MapRef } from 'react-map-gl';
import MainLayout from '../components/layouts/MainLayout/MainLayout';
import { MapContainer } from '../components/ui';

const MapPage = () => {
  const mapRef = useRef<MapRef>(null);

  return (
    <>
      <Head>
        <title>Map view</title>
      </Head>
      <MapContainer />
    </>
  );
};

MapPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default MapPage;
