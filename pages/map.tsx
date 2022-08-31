import Head from 'next/head';
import Map, { MapRef, Marker, NavigationControl } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactElement, useRef } from 'react';
import MainLayout from '../components/layouts/MainLayout/MainLayout';

const MapPage = () => {
  const mapRef = useRef<MapRef>(null);

  return (
    <div>
      <Head>
        <title>Map view</title>
      </Head>

      <Map
        ref={mapRef}
        initialViewState={{
          latitude: 49.23,
          longitude: 19.93,
          zoom: 11,
        }}
        maxPitch={60}
        style={{ width: '1280px', height: '720px' }}
        reuseMaps
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        onClick={(e) => {
          console.log(e.lngLat);

          if (!mapRef.current) {
            return;
          }

          mapRef.current.flyTo({
            center: e.lngLat,
            zoom: 12,
            duration: 500,
          });
        }}
        onZoom={(e) => {
          console.log(e.viewState);
        }}
      >
        <NavigationControl />
        <Marker longitude={19.93} latitude={49.23} color="red" />
      </Map>
    </div>
  );
};

MapPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default MapPage;
