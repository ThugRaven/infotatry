import 'mapbox-gl/dist/mapbox-gl.css';
import Head from 'next/head';
import { ReactElement } from 'react';
import { MainLayout } from '../components/layouts';
import { MapContainer } from '../components/map';

const MapPage = () => {
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
