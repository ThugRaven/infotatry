import { useCallback, useRef, useState } from 'react';
import Map, { MapRef, Marker, NavigationControl } from 'react-map-gl';
import MapPopup from '../MapPopup';

// interface MapContainerProps {
//   prop: string;
// }

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
}

const MapContainer = () => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 49.23,
    longitude: 19.93,
    zoom: 11,
  });
  const [cursor, setCursor] = useState('auto');
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      maxPitch={60}
      reuseMaps
      // mapStyle="mapbox://styles/mapbox/streets-v9"
      mapStyle="mapbox://styles/thugraven/cl7rzd4h3004914lfputsqkg9"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      interactiveLayerIds={['trails-data-layer']}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      cursor={cursor}
      onClick={(e) => {
        // console.log(mapRef.current?.getStyle().layers);
        if (
          !mapRef.current ||
          !e.features ||
          e.features.length === 0 ||
          e.features[0].layer.id !== 'trails-data-layer'
        ) {
          setPopupInfo(null);
          return;
        }

        let trailInfo = {
          lngLat: e.lngLat,
          features: e.features,
        };

        // Return when the coordinates are the same to skip unnecessary render
        if (
          popupInfo &&
          trailInfo.lngLat.lng === popupInfo.lngLat.lng &&
          trailInfo.lngLat.lat === popupInfo.lngLat.lat
        )
          return;

        setPopupInfo(trailInfo);

        // mapRef.current.flyTo({
        //   center: e.lngLat,
        //   zoom: 12,
        //   duration: 500,
        // });
      }}
      onZoom={(e) => {
        // console.log(e.viewState);
      }}
    >
      {popupInfo && (
        <MapPopup
          lngLat={popupInfo.lngLat}
          features={popupInfo.features}
          onClose={() => {
            setPopupInfo(null);
          }}
        />
      )}
      <NavigationControl />
      <Marker longitude={19.93} latitude={49.23} color="red" />
    </Map>
  );
};

export default MapContainer;
