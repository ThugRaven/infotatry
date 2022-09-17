import { Popup, PopupEvent } from 'react-map-gl';
import s from './MapPopup.module.css';

interface MapPopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  onClose: (e: PopupEvent) => void;
}

const MapPopup = ({ lngLat, features, onClose }: MapPopupProps) => {
  return (
    <Popup
      latitude={lngLat.lat}
      longitude={lngLat.lng}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
    >
      {features.length > 0 && features[0].properties ? (
        <div className={s.container}>{features[0].properties.name}</div>
      ) : (
        <div>Brak informacji</div>
      )}
    </Popup>
  );
};

export default MapPopup;
