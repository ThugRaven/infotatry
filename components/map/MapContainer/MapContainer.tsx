import { useCallback, useRef, useState } from 'react';
import Map, { MapRef, Marker, NavigationControl, Popup } from 'react-map-gl';

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
  const [showPopup, setShowPopup] = useState(false);
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
        console.log('click');

        console.log(e);
        console.log(e.features);
        // console.log(mapRef.current?.getStyle().layers);
        if (
          !mapRef.current ||
          !e.features ||
          e.features.length === 0 ||
          e.features[0].layer.id !== 'trails-data-layer'
        )
          return;

        // const trialName = e.features[0].properties.name;

        let trailInfo = {
          lngLat: e.lngLat,
          features: e.features,
        };

        console.log(trailInfo.lngLat, popupInfo?.lngLat);
        console.log(
          popupInfo &&
            trailInfo.lngLat.lng === popupInfo.lngLat.lng &&
            trailInfo.lngLat.lat === popupInfo.lngLat.lat,
        );

        if (
          popupInfo &&
          trailInfo.lngLat.lng === popupInfo.lngLat.lng &&
          trailInfo.lngLat.lat === popupInfo.lngLat.lat
        )
          return;

        console.log(trailInfo);
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
        <Popup
          longitude={popupInfo.lngLat.lng}
          latitude={popupInfo.lngLat.lat}
          anchor="bottom"
          key={`${popupInfo.lngLat.lng}-${popupInfo.lngLat.lat}`}
          onClose={() => {
            console.log('close');
            setPopupInfo(null);
          }}
        >
          <div style={{ color: 'black' }}>
            {popupInfo.features[0].properties.name}
          </div>
        </Popup>
      )}
      <NavigationControl />
      <Marker longitude={19.93} latitude={49.23} color="red" />
    </Map>
  );
};

export default MapContainer;
