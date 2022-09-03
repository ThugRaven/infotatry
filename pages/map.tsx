import 'mapbox-gl/dist/mapbox-gl.css';
import Head from 'next/head';
import { ReactElement } from 'react';
import { MainLayout } from '../components/layouts';
import { MapContainer, MapSidebar } from '../components/map';
import styles from '../styles/MapPage.module.css';

const MapPage = () => {
  return (
    <>
      <Head>
        <title>Map view</title>
      </Head>
      <div className={styles.container}>
        <MapSidebar />
        <MapContainer />
      </div>
    </>
  );
};

MapPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default MapPage;
