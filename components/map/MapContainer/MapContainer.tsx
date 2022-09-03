import { useRef, useState } from 'react';
import Map, { MapRef, Marker, NavigationControl } from 'react-map-gl';

// interface MapContainerProps {
//   prop: string;
// }

const MapContainer = () => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 49.23,
    longitude: 19.93,
    zoom: 11,
  });

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      maxPitch={60}
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
  );
};

export default MapContainer;
