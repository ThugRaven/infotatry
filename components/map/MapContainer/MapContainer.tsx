import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
  MapRef,
  Marker,
  NavigationControl,
  PaddingOptions,
} from 'react-map-gl';
import MapPopup from '../MapPopup';

interface MapContainerProps {
  padding: number;
}

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
}

const MapContainer = ({ padding }: MapContainerProps) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 49.23,
    longitude: 19.93,
    zoom: 11,
  });
  const [cursor, setCursor] = useState('grab');
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('grab'), []);
  const onDragStart = useCallback(() => setCursor('grabbing'), []);
  const onDragEnd = useCallback(() => setCursor('grab'), []);

  useEffect(() => {
    let mapPadding: PaddingOptions = { left: 0, right: 0, bottom: 0, top: 0 };
    if (padding > 0) {
      mapPadding.right = padding;
    } else {
      mapPadding.left = padding;
    }

    mapRef.current?.easeTo({
      padding: mapPadding,
      duration: 250,
    });
  }, [padding]);

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
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
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
