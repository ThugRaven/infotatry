import { Button, ButtonGroup } from '@chakra-ui/react';
import { Trail } from 'pages/dashboard/admin/map';
import { Popup, PopupEvent } from 'react-map-gl';
import s from './TrailAdminPopup.module.css';

interface TrailAdminPopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  trail: Trail;
  onClose: (e: PopupEvent) => void;
  onRemove: (name: string) => void;
}

const TrailAdminPopup = ({
  lngLat,
  features,
  trail,
  onClose,
  onRemove,
}: TrailAdminPopupProps) => {
  const feature = features[0];

  const handleRemove = () => {
    if (feature && feature.properties) {
      onRemove(feature.properties.name);
    }
  };

  return (
    <Popup
      latitude={lngLat.lat}
      longitude={lngLat.lng}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
    >
      {feature && feature.properties ? (
        <div className={s.container}>
          {feature.properties.name}
          <ButtonGroup size="xs" display={'flex'} flexWrap={'wrap'} spacing={0}>
            <Button onClick={handleRemove}>Remove trail</Button>
          </ButtonGroup>
        </div>
      ) : (
        <div>Brak informacji</div>
      )}
    </Popup>
  );
};

export default TrailAdminPopup;
